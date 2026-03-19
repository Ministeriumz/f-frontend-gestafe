"use client";

import React, { useEffect, useMemo } from "react";
import Table, { Column } from "@/components/Table/table";
import { useEventos, ResponseCode } from "@/hooks";
import Loading from "@/components/Loading/loading";
import { toast } from "sonner";

type EventoView = {
  id: number;
  nome: string;
  tipo: string;
  resumo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
};

const columns: Column<EventoView>[] = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "tipo", label: "Tipo" },
  { key: "resumo", label: "Resumo" },
  {
    key: "data",
    label: "Data",
    render: (value) => {
      const text = String(value || "");
      if (!text) return "-";
      const parsed = new Date(text);
      return isNaN(parsed.getTime()) ? text : parsed.toLocaleDateString("pt-BR");
    },
  },
  { key: "hora_inicio", label: "Inicio" },
  { key: "hora_fim", label: "Fim" },
];

export default function EventosPage() {
  const { data, loading, error, getAll, create, update, remove } = useEventos();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const rows = useMemo<EventoView[]>(
    () =>
      data.map((evento) => ({
        id: evento.id || 0,
        nome: evento.nome,
        tipo: evento.tipo,
        resumo: evento.resumo,
        data: evento.data,
        hora_inicio: evento.hora_inicio,
        hora_fim: evento.hora_fim,
      })),
    [data]
  );

  const onCreate = async (form: any) => {
    const result = await create({
      nome: String(form.nome || ""),
      tipo: String(form.tipo || ""),
      resumo: String(form.resumo || ""),
      data: String(form.data || ""),
      hora_inicio: String(form.hora_inicio || ""),
      hora_fim: String(form.hora_fim || ""),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Evento criado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: EventoView) => {
    const result = await update({
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
      resumo: row.resumo,
      data: row.data,
      hora_inicio: row.hora_inicio,
      hora_fim: row.hora_fim,
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Evento atualizado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: EventoView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Evento removido");
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
      columnsSearch={["nome", "tipo", "resumo"]}
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
        { key: "tipo", placeholder: "Tipo" },
        { key: "resumo", placeholder: "Resumo" },
        { key: "data", placeholder: "Data", type: "date" },
        { key: "hora_inicio", placeholder: "Hora Inicio", type: "time" },
        { key: "hora_fim", placeholder: "Hora Fim", type: "time" },
      ]}
    />
  );
}
