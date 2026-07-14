"use client";
//* Libraries imports

//* Libraries imports
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

//* Components imports
import Table, { Column } from "@/components/table/table";
import Loading from "@/components/loading/loading";

//* Hooks imports
import { ResponseCode, useIgrejas, useTiposUsuario, useUsuarios } from "@/hooks";

type MembroView = {
  id: number;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  senha: string;
  idIgreja: number;
  idTipoUsuario: number;
};

const columns: Column<MembroView>[] = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "sobrenome", label: "Sobrenome" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "Email" },
  { key: "idIgreja", label: "Igreja ID" },
  { key: "idTipoUsuario", label: "Tipo Usuario ID" },
];

export default function MembrosPage() {
  const { data, loading, error, getAll, create, update, remove } = useUsuarios();
  const { data: igrejas, getAll: getAllIgrejas } = useIgrejas();
  const { data: tipos, getAll: getAllTipos } = useTiposUsuario();

  useEffect(() => {
    getAll();
    getAllIgrejas();
    getAllTipos();
  }, [getAll, getAllIgrejas, getAllTipos]);

  const rows = useMemo<MembroView[]>(
    () =>
      data.map((usuario) => ({
        id: usuario.id || 0,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        telefone: usuario.telefone,
        email: usuario.email,
        senha: usuario.senha || "",
        idIgreja: usuario.idIgreja,
        idTipoUsuario: usuario.idTipoUsuario,
      })),
    [data]
  );

  const onCreate = async (form: any) => {
    const result = await create({
      nome: String(form.nome || ""),
      sobrenome: String(form.sobrenome || ""),
      telefone: String(form.telefone || ""),
      email: String(form.email || ""),
      senha: String(form.senha || ""),
      idIgreja: Number(form.idIgreja || 1),
      idTipoUsuario: Number(form.idTipoUsuario || 1),
    });

    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Membro criado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: MembroView) => {
    const result = await update({
      id: row.id,
      nome: row.nome,
      sobrenome: row.sobrenome,
      telefone: row.telefone,
      email: row.email,
      senha: row.senha || "",
      idIgreja: Number(row.idIgreja),
      idTipoUsuario: Number(row.idTipoUsuario),
    });

    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Membro atualizado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: MembroView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Membro removido");
      return;
    }
    toast.error(result.message);
  };

  if (loading) return <Loading />;
  if (error) return <div className="flex justify-center items-center p-8 text-danger">Erro: {error}</div>;

  return (
    <Table
      columns={columns}
      data={rows}
      columnsSearch={["nome", "sobrenome", "email"]}
      actions={[
        { name: "Editar", func: onEdit, type: "edit" },
        { name: "Excluir", func: onDelete, type: "delete" },
        { name: "Cadastrar", func: onCreate, type: "create" },
      ]}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      formFields={[
        { key: "nome", placeholder: "Nome" },
        { key: "sobrenome", placeholder: "Sobrenome" },
        { key: "telefone", placeholder: "Telefone" },
        { key: "email", placeholder: "Email" },
        { key: "senha", placeholder: "Senha" },
        {
          key: "idIgreja",
          placeholder: "Igreja",
          type: "search-select",
          options: igrejas.map((igreja) => ({
            label: `${igreja.nome} (${igreja.cnpj})`,
            value: igreja.id || 0,
          })),
        },
        {
          key: "idTipoUsuario",
          placeholder: "Tipo de Usuario",
          type: "search-select",
          options: tipos.map((tipo) => ({
            label: tipo.nome,
            value: tipo.id || 0,
          })),
        },
      ]}
    />
  );
}
