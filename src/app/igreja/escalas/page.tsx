"use client";

import React, { useEffect, useMemo, useState } from "react";
import Loading from "@/components/loading/loading";
import { ResponseCode, useCargos, useEscalas } from "@/hooks";
import { toast } from "sonner";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ─── Types ─────────────────────────────────────────────────────────────────────

type EscalaView = {
    id: number;
    data: string;
    horaInicio: string;
    horaFim: string;
    cargoId: number;
};

type HorarioSlot = {
    inicio: string;
    fim: string;
    label: string;
};

type QuickAddState = {
    slotKey: string;
    cargoId: string;
};

type NewSlotForm = {
    horaInicio: string;
    horaFim: string;
    cargoId: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatHora(h: string) {
    return h?.slice(0, 5) ?? "";
}

function dateToInput(d: Date) {
    return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
}

function formatDateDisplay(iso: string) {
    const [y, m, day] = iso.split("-");
    return `${day}/${m}/${y}`;
}

function slotKey(inicio: string, fim: string) {
    return `${inicio}|${fim}`;
}

function getTurnoIcon(hora: string) {
    const h = Number((hora ?? "00:00:00").split(":")[0]);
    if (h < 12) return <LightModeOutlinedIcon style={{ fontSize: 14 }} />;
    if (h < 18) return <WbSunnyOutlinedIcon style={{ fontSize: 14 }} />;
    return <NightsStayOutlinedIcon style={{ fontSize: 14 }} />;
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function EscalasPage() {
    const { data, loading, error, getAll, create, remove } = useEscalas();
    const { data: cargos, getAll: getAllCargos } = useCargos();

    const [selectedDate, setSelectedDate] = useState<string>(dateToInput(new Date()));
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    const [quickAdd, setQuickAdd] = useState<QuickAddState | null>(null);
    const [newSlotForm, setNewSlotForm] = useState<NewSlotForm>({ horaInicio: "", horaFim: "", cargoId: "" });
    const [newSlotOpen, setNewSlotOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAll();
        getAllCargos();
    }, [getAll, getAllCargos]);

    // escalas do dia selecionado
    const escalasDoDia = useMemo<EscalaView[]>(() => {
        return data
            .filter((e) => e.data?.slice(0, 10) === selectedDate)
            .map((e) => ({
                id: e.id ?? 0,
                data: e.data,
                horaInicio: e.horaInicio,
                horaFim: e.horaFim,
                cargoId: e.cargoId,
            }));
    }, [data, selectedDate]);

    // slots únicos (colunas) inferidos apenas das escalas do dia selecionado
    const slots = useMemo<HorarioSlot[]>(() => {
        const seen = new Set<string>();
        const result: HorarioSlot[] = [];
        escalasDoDia.forEach((e) => {
            const key = slotKey(e.horaInicio, e.horaFim);
            if (!seen.has(key)) {
                seen.add(key);
                result.push({
                    inicio: e.horaInicio,
                    fim: e.horaFim,
                    label: `${formatHora(e.horaInicio)} – ${formatHora(e.horaFim)}`,
                });
            }
        });
        return result.sort((a, b) => a.inicio.localeCompare(b.inicio));
    }, [escalasDoDia]);

    const cargoMap = useMemo(() => {
        const m = new Map<number, string>();
        cargos.forEach((c) => m.set(c.idCargo ?? 0, c.nome));
        return m;
    }, [cargos]);

    // ── Quick add (slot já existe) ───────────────────────────────────────────

    const handleQuickAdd = async (slot: HorarioSlot) => {
        const key = slotKey(slot.inicio, slot.fim);

        if (!quickAdd || quickAdd.slotKey !== key) {
            setQuickAdd({ slotKey: key, cargoId: "" });
            return;
        }

        if (!quickAdd.cargoId) {
            toast.error("Selecione um cargo");
            return;
        }

        setSaving(true);
        const result = await create({
            data: selectedDate,
            horaInicio: slot.inicio,
            horaFim: slot.fim,
            cargoId: Number(quickAdd.cargoId),
        });
        setSaving(false);

        if (result.code === ResponseCode.SUCCESS) {
            toast.success("Escala adicionada");
            getAll();
            setQuickAdd(null);
        } else {
            toast.error(result.message ?? "Erro ao criar escala");
        }
    };

    // ── Criar novo slot ──────────────────────────────────────────────────────

    const handleCreateNewSlot = async () => {
        if (!newSlotForm.horaInicio || !newSlotForm.horaFim || !newSlotForm.cargoId) {
            toast.error("Preencha todos os campos");
            return;
        }

        setSaving(true);
        const result = await create({
            data: selectedDate,
            horaInicio: `${newSlotForm.horaInicio}:00`,
            horaFim: `${newSlotForm.horaFim}:00`,
            cargoId: Number(newSlotForm.cargoId),
        });
        setSaving(false);

        if (result.code === ResponseCode.SUCCESS) {
            toast.success("Escala criada");
            getAll();
            setNewSlotOpen(false);
            setNewSlotForm({ horaInicio: "", horaFim: "", cargoId: "" });
        } else {
            toast.error(result.message ?? "Erro ao criar escala");
        }
    };

    const handleDelete = async (id: number) => {
        const result = await remove(id);
        if (result.code === ResponseCode.SUCCESS) {
            toast.success("Escala removida");
            getAll();
        } else {
            toast.error(result.message ?? "Erro ao remover");
        }
    };

    // ── Calendário ───────────────────────────────────────────────────────────

    const calendarDays = useMemo(() => {
        const { year, month } = calendarMonth;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: (number | null)[] = Array(firstDay).fill(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    }, [calendarMonth]);

    const monthLabel = useMemo(() =>
        new Date(calendarMonth.year, calendarMonth.month, 1)
            .toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        [calendarMonth]
    );

    // ── Render ───────────────────────────────────────────────────────────────

    if (loading) return <Loading />;
    if (error)   return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            <section className="glass-panel rounded-xl p-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-700">Board de Escalas</h2>
                        <p className="text-xs text-neutral-400">
                            Clique em{" "}
                            <span className="font-semibold text-neutral-500">+</span>
                            {" "}para adicionar um cargo ao turno. Use o calendário para trocar o dia.
                        </p>
                    </div>

                    {/* Seletor de data */}
                    <div className="relative self-start sm:self-auto">
                        <button
                            onClick={() => setCalendarOpen((v) => !v)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-soft border border-white/60 text-sm text-neutral-600 hover:bg-white/60 transition-colors"
                        >
                            <CalendarTodayOutlinedIcon style={{ fontSize: 15 }} />
                            {formatDateDisplay(selectedDate)}
                            <ExpandMoreIcon
                                style={{ fontSize: 15 }}
                                className={`transition-transform duration-200 ${calendarOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {calendarOpen && (
                            <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border border-neutral-100 p-3 w-64">
                                <div className="flex items-center justify-between mb-3">
                                    <button
                                        onClick={() => setCalendarMonth((p) => {
                                            const d = new Date(p.year, p.month - 1, 1);
                                            return { year: d.getFullYear(), month: d.getMonth() };
                                        })}
                                        className="p-1 hover:bg-neutral-100 rounded-md transition-colors"
                                    >
                                        <ChevronLeftIcon style={{ fontSize: 16 }} />
                                    </button>
                                    <span className="text-xs font-semibold text-neutral-700 capitalize">
                                        {monthLabel}
                                    </span>
                                    <button
                                        onClick={() => setCalendarMonth((p) => {
                                            const d = new Date(p.year, p.month + 1, 1);
                                            return { year: d.getFullYear(), month: d.getMonth() };
                                        })}
                                        className="p-1 hover:bg-neutral-100 rounded-md transition-colors"
                                    >
                                        <ChevronRightIcon style={{ fontSize: 16 }} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 mb-1">
                                    {["D","S","T","Q","Q","S","S"].map((d, i) => (
                                        <span key={i} className="text-center text-[10px] font-medium text-neutral-400 py-0.5">
                                            {d}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-0.5">
                                    {calendarDays.map((day, i) => {
                                        if (!day) return <span key={i} />;
                                        const iso = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                        const isSelected = iso === selectedDate;
                                        const isToday    = iso === dateToInput(new Date());
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => { setSelectedDate(iso); setCalendarOpen(false); }}
                                                className={`
                                                    text-xs rounded-md py-1 transition-colors
                                                    ${isSelected ? "bg-neutral-800 text-white font-semibold" :
                                                      isToday    ? "bg-neutral-100 text-neutral-700 font-semibold" :
                                                                   "text-neutral-600 hover:bg-neutral-100"}
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-1.5 mt-3 pt-3 border-t border-neutral-100">
                                    {[-1, 0, 1].map((offset) => {
                                        const d   = addDays(new Date(), offset);
                                        const iso = dateToInput(d);
                                        const lbl = offset === -1 ? "Ontem" : offset === 0 ? "Hoje" : "Amanhã";
                                        return (
                                            <button
                                                key={offset}
                                                onClick={() => { setSelectedDate(iso); setCalendarOpen(false); }}
                                                className={`
                                                    flex-1 text-[10px] font-medium px-1 py-1 rounded-md transition-colors
                                                    ${selectedDate === iso
                                                        ? "bg-neutral-800 text-white"
                                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}
                                                `}
                                            >
                                                {lbl}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Colunas de slots */}
                {slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-neutral-400 gap-2">
                        <AccessTimeOutlinedIcon style={{ fontSize: 36 }} className="opacity-30" />
                        <p className="text-sm font-medium">Nenhum turno cadastrado</p>
                        <p className="text-xs">Crie a primeira escala abaixo para definir os turnos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {slots.map((slot) => {
                            const key = slotKey(slot.inicio, slot.fim);
                            const escalasNoSlot = escalasDoDia.filter(
                                (e) => slotKey(e.horaInicio, e.horaFim) === key
                            );
                            const isAdding = quickAdd?.slotKey === key;

                            return (
                                <div key={key} className="glass-soft rounded-xl border border-white/60 overflow-hidden">
                                    {/* Cabeçalho */}
                                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/50 bg-white/30">
                                        <div className="flex items-center gap-1.5 text-neutral-600">
                                            {getTurnoIcon(slot.inicio)}
                                            <span className="text-xs font-semibold">{slot.label}</span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-neutral-400 bg-white/60 px-1.5 py-0.5 rounded-full tabular-nums">
                                            {escalasNoSlot.length}
                                        </span>
                                    </div>

                                    {/* Itens */}
                                    <div className="p-2 flex flex-col gap-1.5 min-h-[90px]">
                                        {escalasNoSlot.map((e) => (
                                            <div
                                                key={e.id}
                                                className="flex items-center justify-between px-2.5 py-2 bg-white/60 rounded-lg group"
                                            >
                                                <span className="text-xs font-medium text-neutral-700 truncate">
                                                    {cargoMap.get(e.cargoId) ?? `Cargo ${e.cargoId}`}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(e.id)}
                                                    title="Remover"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-400 ml-2 flex-shrink-0"
                                                >
                                                    <DeleteOutlineIcon style={{ fontSize: 14 }} />
                                                </button>
                                            </div>
                                        ))}

                                        {escalasNoSlot.length === 0 && !isAdding && (
                                            <p className="text-[11px] text-neutral-400 text-center py-3">
                                                Nenhuma escala neste dia
                                            </p>
                                        )}

                                        {/* Quick add inline */}
                                        {isAdding ? (
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <select
                                                    autoFocus
                                                    value={quickAdd.cargoId}
                                                    onChange={(e) =>
                                                        setQuickAdd((p) => p ? { ...p, cargoId: e.target.value } : null)
                                                    }
                                                    className="flex-1 text-xs rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-neutral-700 outline-none focus:border-neutral-400 min-w-0"
                                                >
                                                    <option value="">Cargo...</option>
                                                    {cargos.map((c) => (
                                                        <option key={c.idCargo} value={c.idCargo}>
                                                            {c.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleQuickAdd(slot)}
                                                    disabled={saving}
                                                    className="p-1.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors disabled:opacity-50 flex-shrink-0"
                                                >
                                                    <CheckIcon style={{ fontSize: 13 }} />
                                                </button>
                                                <button
                                                    onClick={() => setQuickAdd(null)}
                                                    className="p-1.5 rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors flex-shrink-0"
                                                >
                                                    <CloseIcon style={{ fontSize: 13 }} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleQuickAdd(slot)}
                                                className="flex items-center justify-center gap-1 w-full py-1.5 mt-0.5 rounded-lg border border-dashed border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 hover:bg-white/40 transition-all text-xs"
                                            >
                                                <AddIcon style={{ fontSize: 13 }} />
                                                Adicionar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Novo turno */}
                <div className="mt-4 pt-4 border-t border-white/50">
                    {newSlotOpen ? (
                        <div className="flex flex-wrap items-end gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">
                                    Início
                                </label>
                                <input
                                    type="time"
                                    value={newSlotForm.horaInicio}
                                    onChange={(e) => setNewSlotForm((p) => ({ ...p, horaInicio: e.target.value }))}
                                    className="text-xs rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-neutral-700 outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">
                                    Fim
                                </label>
                                <input
                                    type="time"
                                    value={newSlotForm.horaFim}
                                    onChange={(e) => setNewSlotForm((p) => ({ ...p, horaFim: e.target.value }))}
                                    className="text-xs rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-neutral-700 outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">
                                    Cargo
                                </label>
                                <select
                                    value={newSlotForm.cargoId}
                                    onChange={(e) => setNewSlotForm((p) => ({ ...p, cargoId: e.target.value }))}
                                    className="text-xs rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-neutral-700 outline-none focus:border-neutral-400"
                                >
                                    <option value="">Selecione...</option>
                                    {cargos.map((c) => (
                                        <option key={c.idCargo} value={c.idCargo}>
                                            {c.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={handleCreateNewSlot}
                                    disabled={saving}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                >
                                    <CheckIcon style={{ fontSize: 13 }} />
                                    Criar
                                </button>
                                <button
                                    onClick={() => {
                                        setNewSlotOpen(false);
                                        setNewSlotForm({ horaInicio: "", horaFim: "", cargoId: "" });
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-medium hover:bg-neutral-200 transition-colors"
                                >
                                    <CloseIcon style={{ fontSize: 13 }} />
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setNewSlotOpen(true)}
                            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                        >
                            <AddIcon style={{ fontSize: 15 }} />
                            Novo turno / escala
                        </button>
                    )}
                </div>

            </section>
        </div>
    );
}