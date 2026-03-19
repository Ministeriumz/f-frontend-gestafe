"use client";

import React, { useEffect, useMemo } from "react";
import Table, { Column } from "@/components/Table/table";
import { useMinisterios, ResponseCode } from "@/hooks";
import Loading from "@/components/Loading/loading";
import { toast } from "sonner";

type MinisterioView = {
  id: number;
  nome: string;
  tamanho_max: number;
};

const columns: Column<MinisterioView>[] = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "tamanho_max", label: "Tamanho Maximo" },
];

export default function MinisteriosPage() {
  const { data, loading, error, getAll, create, update, remove } = useMinisterios();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const rows = useMemo<MinisterioView[]>(
    () =>
      data.map((ministerio) => ({
        id: ministerio.id || 0,
        nome: ministerio.nome,
        tamanho_max: ministerio.tamanho_max,
      })),
    [data]
  );

  const onCreate = async (form: any) => {
    const result = await create({
      nome: String(form.nome || ""),
      tamanho_max: Number(form.tamanho_max || 0),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Ministerio criado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: MinisterioView) => {
    const result = await update({
      id: row.id,
      nome: row.nome,
      tamanho_max: Number(row.tamanho_max),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Ministerio atualizado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: MinisterioView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Ministerio removido");
      return;
    }
    toast.error(result.message);
  };

  if (loading) return <Loading />;
  if (error) return <div className="flex justify-center items-center p-8 text-red-500">Erro: {error}</div>;

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
      formFields={[
        { key: "nome", placeholder: "Nome" },
        { key: "tamanho_max", placeholder: "Tamanho Maximo" },
      ]}
    />
  );
}

