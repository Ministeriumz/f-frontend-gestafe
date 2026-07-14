"use client";
//* Libraries imports

//* Libraries imports
import { useEffect, useMemo, useState } from "react";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { toast } from "sonner";

//* Components imports
import ConfirmDialog from "@/components/dialog";
import Loading from "@/components/loading/loading";
import NewShiftCard from "./_components/NewShiftCard";
import ScaleHeader from "./_components/ScaleHeader";
import ShiftCard from "./_components/ShiftCard";

//* Hooks imports
import { ResponseCode, useCargos, useEscalas } from "@/hooks";

//* Types imports
import type { NewShiftInput, RoleOption, ScaleView, ShiftGroup } from "./_components/scale-types";

const EMPTY_SHIFT: NewShiftInput = { horaInicio: "", horaFim: "", cargoId: "" };

function dateToInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function EscalasPage() {
  const { data, loading, error, getAll, create, remove } = useEscalas();
  const { data: cargos, getAll: getAllCargos } = useCargos();
  const [selectedDate, setSelectedDate] = useState(() => dateToInput(new Date()));
  const [newShiftOpen, setNewShiftOpen] = useState(false);
  const [newShift, setNewShift] = useState<NewShiftInput>(EMPTY_SHIFT);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ScaleView | null>(null);

  useEffect(() => { void Promise.all([getAll(), getAllCargos()]); }, [getAll, getAllCargos]);

  const roles = useMemo<RoleOption[]>(() => cargos.filter((cargo) => cargo.idCargo).map((cargo) => ({ id: cargo.idCargo as number, nome: cargo.nome })), [cargos]);
  const dayScales = useMemo<ScaleView[]>(() => data.filter((scale) => scale.data.slice(0, 10) === selectedDate && scale.id).map((scale) => ({ ...scale, id: scale.id as number })), [data, selectedDate]);
  const shifts = useMemo<ShiftGroup[]>(() => {
    const groups = new Map<string, ShiftGroup>();
    dayScales.forEach((scale) => {
      const key = `${scale.horaInicio}|${scale.horaFim}`;
      const group = groups.get(key) ?? { key, inicio: scale.horaInicio, fim: scale.horaFim, scales: [] };
      group.scales.push(scale);
      groups.set(key, group);
    });
    return Array.from(groups.values()).sort((a, b) => a.inicio.localeCompare(b.inicio));
  }, [dayScales]);

  const moveDate = (days: number) => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    setSelectedDate(dateToInput(date));
  };

  const addToShift = async (shift: ShiftGroup, roleId: number) => {
    setSaving(true);
    const result = await create({ data: selectedDate, horaInicio: shift.inicio, horaFim: shift.fim, cargoId: roleId });
    setSaving(false);
    if (result.code !== ResponseCode.SUCCESS) { toast.error(result.message ?? "Erro ao adicionar escala"); return false; }
    toast.success("Cargo adicionado ao turno");
    await getAll();
    return true;
  };

  const createShift = async () => {
    if (!newShift.horaInicio || !newShift.horaFim || !newShift.cargoId) { toast.error("Preencha todos os campos"); return; }
    if (newShift.horaFim <= newShift.horaInicio) { toast.error("O horário final deve ser posterior ao inicial"); return; }
    setSaving(true);
    const result = await create({ data: selectedDate, horaInicio: `${newShift.horaInicio}:00`, horaFim: `${newShift.horaFim}:00`, cargoId: Number(newShift.cargoId) });
    setSaving(false);
    if (result.code !== ResponseCode.SUCCESS) { toast.error(result.message ?? "Erro ao criar turno"); return; }
    toast.success("Turno criado");
    setNewShift(EMPTY_SHIFT);
    setNewShiftOpen(false);
    await getAll();
  };

  const deleteScale = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    const result = await remove(pendingDelete.id);
    setSaving(false);
    if (result.code !== ResponseCode.SUCCESS) { toast.error(result.message ?? "Erro ao remover escala"); return; }
    toast.success("Escala removida");
    await getAll();
  };

  if (loading && data.length === 0) return <Loading />;
  if (error && data.length === 0) return <p className="p-4 text-danger">{error}</p>;

  return (
    <div className="schedule-page">
      <ScaleHeader selectedDate={selectedDate} assignments={dayScales.length} shifts={shifts.length} onDateChange={setSelectedDate} onMoveDate={moveDate} onToday={() => setSelectedDate(dateToInput(new Date()))} />

      <div className="schedule-section-heading"><div><span>Planejamento do dia</span><h2>Turnos organizados</h2></div><p>{shifts.length ? "Adicione ou remova responsabilidades em cada horário." : "Comece criando o primeiro turno deste dia."}</p></div>

      {shifts.length ? <div className="schedule-board">{shifts.map((shift) => <ShiftCard key={shift.key} shift={shift} roles={roles} saving={saving} onAdd={addToShift} onRequestDelete={setPendingDelete} />)}</div> : (
        <div className="schedule-empty-day glass-panel"><EventBusyRoundedIcon /><strong>Nenhuma escala para esta data</strong><p>Crie um turno para começar a organizar os cargos do encontro.</p></div>
      )}

      <NewShiftCard open={newShiftOpen} value={newShift} roles={roles} saving={saving} onOpen={() => setNewShiftOpen(true)} onClose={() => { setNewShiftOpen(false); setNewShift(EMPTY_SHIFT); }} onChange={(field, value) => setNewShift((current) => ({ ...current, [field]: value }))} onSubmit={createShift} />

      <ConfirmDialog isOpen={Boolean(pendingDelete)} title="Remover esta escala?" description={`A responsabilidade de ${roles.find((role) => role.id === pendingDelete?.cargoId)?.nome ?? "cargo selecionado"} será removida deste turno.`} confirmLabel="Remover escala" loading={saving} onCancel={() => setPendingDelete(null)} onConfirm={deleteScale} />
    </div>
  );
}
