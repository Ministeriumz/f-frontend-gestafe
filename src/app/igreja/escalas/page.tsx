"use client";

import React, { DragEvent, useEffect, useMemo, useState } from "react";
import Table, { Column } from "@/components/Table/table";
import Loading from "@/components/Loading/loading";
import { ResponseCode, useCargos, useEscalas } from "@/hooks";
import { toast } from "sonner";

type EscalaView = {
  id: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  cargoId: number;
};

type Turno = "manha" | "tarde" | "noite";

const turnos: { key: Turno; label: string; horario: { inicio: string; fim: string } }[] = [
  { key: "manha", label: "Manha", horario: { inicio: "08:00:00", fim: "12:00:00" } },
  { key: "tarde", label: "Tarde", horario: { inicio: "13:00:00", fim: "17:00:00" } },
  { key: "noite", label: "Noite", horario: { inicio: "18:00:00", fim: "22:00:00" } },
];

const columns: Column<EscalaView>[] = [
  { key: "id", label: "ID" },
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
  { key: "horaInicio", label: "Hora Inicio" },
  { key: "horaFim", label: "Hora Fim" },
  { key: "cargoId", label: "Cargo ID" },
];

function getTurnoByHora(horaInicio: string): Turno {
  const hour = Number((horaInicio || "00:00:00").split(":")[0]);
  if (hour < 13) return "manha";
  if (hour < 18) return "tarde";
  return "noite";
}

export default function EscalasPage() {
  const { data, loading, error, getAll, create, update, remove } = useEscalas();
  const { data: cargos, getAll: getAllCargos } = useCargos();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [savingMove, setSavingMove] = useState(false);

  useEffect(() => {
    getAll();
    getAllCargos();
  }, [getAll, getAllCargos]);

  const rows = useMemo<EscalaView[]>(
    () =>
      data.map((item) => ({
        id: item.id || 0,
        data: item.data,
        horaInicio: item.horaInicio,
        horaFim: item.horaFim,
        cargoId: item.cargoId,
      })),
    [data]
  );

  const cargoById = useMemo(() => {
    const map = new Map<number, string>();
    cargos.forEach((cargo) => map.set(cargo.idCargo || 0, cargo.nome));
    return map;
  }, [cargos]);

  const board = useMemo(() => {
    return {
      manha: rows.filter((item) => getTurnoByHora(item.horaInicio) === "manha"),
      tarde: rows.filter((item) => getTurnoByHora(item.horaInicio) === "tarde"),
      noite: rows.filter((item) => getTurnoByHora(item.horaInicio) === "noite"),
    };
  }, [rows]);

  const onCreate = async (form: any) => {
    const result = await create({
      data: String(form.data || ""),
      horaInicio: String(form.horaInicio || ""),
      horaFim: String(form.horaFim || ""),
      cargoId: Number(form.cargoId || 0),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Escala criada");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: EscalaView) => {
    const result = await update({
      id: Number(row.id),
      data: String(row.data),
      horaInicio: String(row.horaInicio),
      horaFim: String(row.horaFim),
      cargoId: Number(row.cargoId),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Escala atualizada");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: EscalaView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Escala removida");
      return;
    }
    toast.error(result.message);
  };

  const onDropCard = async (event: DragEvent<HTMLDivElement>, targetTurno: Turno) => {
    event.preventDefault();
    if (!draggingId) return;

    const found = rows.find((item) => item.id === draggingId);
    if (!found) return;

    const target = turnos.find((item) => item.key === targetTurno);
    if (!target) return;

    if (getTurnoByHora(found.horaInicio) === targetTurno) return;

    setSavingMove(true);
    const result = await update({
      ...found,
      horaInicio: target.horario.inicio,
      horaFim: target.horario.fim,
    });
    setSavingMove(false);

    if (result.code === ResponseCode.SUCCESS) {
      toast.success(`Escala movida para ${target.label}`);
      getAll();
      return;
    }

    toast.error(result.message || "Falha ao mover escala");
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-neutral-700">Board de Escalas</h2>
            <p className="text-xs md:text-sm text-neutral-500">Arraste os cards entre turnos para atualizar horarios.</p>
          </div>
          {savingMove && <span className="text-xs text-amber-600">Salvando mudanca...</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {turnos.map((turno) => (
            <div
              key={turno.key}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onDropCard(event, turno.key)}
              className="glass-soft rounded-lg border border-dashed border-white/60 p-3 min-h-44"
            >
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                {turno.label} ({turno.horario.inicio.slice(0, 5)} - {turno.horario.fim.slice(0, 5)})
              </h3>

              <div className="space-y-2">
                {board[turno.key].map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggingId(item.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className="glass-panel rounded-md p-2 cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-xs text-neutral-400">Escala #{item.id}</div>
                    <div className="text-sm font-semibold text-neutral-700">{cargoById.get(item.cargoId) || `Cargo ${item.cargoId}`}</div>
                    <div className="text-xs text-neutral-500">{item.data}</div>
                  </div>
                ))}

                {board[turno.key].length === 0 && (
                  <div className="text-xs text-neutral-500 p-2 border border-white/55 rounded glass-soft">Sem escalas neste turno</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-xl p-3">
        <Table
          columns={columns}
          data={rows}
          columnsSearch={["data", "cargoId"]}
          actions={[
            { name: "Editar", func: onEdit, color: "#82ACAA", type: "edit" },
            { name: "Excluir", func: onDelete, color: "#AC8282", type: "delete" },
            { name: "Cadastrar", func: onCreate, color: "#82ACAA", type: "create" },
          ]}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
          formFields={[
            { key: "data", placeholder: "Data", type: "date" },
            { key: "horaInicio", placeholder: "Hora Inicio", type: "time" },
            { key: "horaFim", placeholder: "Hora Fim", type: "time" },
            {
              key: "cargoId",
              placeholder: "Cargo",
              type: "search-select",
              options: cargos.map((cargo) => ({
                label: cargo.nome,
                value: cargo.idCargo || 0,
              })),
            },
          ]}
        />
      </section>
    </div>
  );
}
