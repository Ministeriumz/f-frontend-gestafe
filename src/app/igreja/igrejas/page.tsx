"use client";

import React, { useEffect, useMemo } from "react";
import Table, { Column } from "@/components/Table/table";
import Loading from "@/components/Loading/loading";
import { ResponseCode, useIgrejas } from "@/hooks";
import { toast } from "sonner";

type IgrejaView = {
  id: number;
  nome: string;
  cnpj: string;
  estado: string;
  rua: string;
  cep: string;
  numero: string;
};

const columns: Column<IgrejaView>[] = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "cnpj", label: "CNPJ" },
  { key: "estado", label: "Estado" },
  { key: "rua", label: "Rua" },
  { key: "cep", label: "CEP" },
  { key: "numero", label: "Numero" },
];

export default function IgrejasPage() {
  const { data, loading, error, getAll, create, update, remove } = useIgrejas();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const rows = useMemo<IgrejaView[]>(
    () =>
      data.map((item) => ({
        id: item.id || 0,
        nome: item.nome,
        cnpj: item.cnpj,
        estado: item.estado,
        rua: item.rua,
        cep: item.cep,
        numero: item.numero,
      })),
    [data]
  );

  const onCreate = async (form: any) => {
    const result = await create({
      nome: String(form.nome || ""),
      cnpj: String(form.cnpj || ""),
      estado: String(form.estado || ""),
      rua: String(form.rua || ""),
      cep: String(form.cep || ""),
      numero: String(form.numero || ""),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Igreja criada");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: IgrejaView) => {
    const result = await update({
      id: row.id,
      nome: row.nome,
      cnpj: row.cnpj,
      estado: row.estado,
      rua: row.rua,
      cep: row.cep,
      numero: row.numero,
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Igreja atualizada");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: IgrejaView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Igreja removida");
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
      columnsSearch={["nome", "cnpj", "estado"]}
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
        { key: "cnpj", placeholder: "CNPJ" },
        { key: "estado", placeholder: "Estado" },
        { key: "rua", placeholder: "Rua" },
        { key: "cep", placeholder: "CEP" },
        { key: "numero", placeholder: "Numero" },
      ]}
    />
  );
}
