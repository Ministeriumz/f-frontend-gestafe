"use client";

import React, { useEffect, useMemo } from "react";
import Table, { Column } from "@/components/Table/table";
import Loading from "@/components/Loading/loading";
import { ResponseCode, useTiposUsuario } from "@/hooks";
import { toast } from "sonner";

type TipoUsuarioView = {
  id: number;
  nome: string;
};

const columns: Column<TipoUsuarioView>[] = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
];

export default function TiposUsuarioPage() {
  const { data, loading, error, getAll, create, atualizarParcial, remove } = useTiposUsuario();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const rows = useMemo<TipoUsuarioView[]>(
    () =>
      data.map((item) => ({
        id: item.id || 0,
        nome: item.nome,
      })),
    [data]
  );

  const onCreate = async (form: any) => {
    const result = await create({
      nome: String(form.nome || ""),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Tipo de usuario criado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: TipoUsuarioView) => {
    const result = await atualizarParcial(row.id, { nome: row.nome });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Tipo de usuario atualizado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: TipoUsuarioView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Tipo de usuario removido");
      return;
    }
    toast.error(result.message);
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <Table
      columns={columns}
      data={rows}
      columnsSearch={["nome"]}
      actions={[
        { name: "Editar", func: onEdit, color: "#82ACAA", type: "edit" },
        { name: "Excluir", func: onDelete, color: "#AC8282", type: "delete" },
        { name: "Cadastrar", func: onCreate, color: "#82ACAA", type: "create" },
      ]}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      formFields={[{ key: "nome", placeholder: "Nome" }]}
    />
  );
}
