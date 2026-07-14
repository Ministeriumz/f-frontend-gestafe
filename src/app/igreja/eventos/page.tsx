"use client";

import React, { useEffect, useMemo, useState } from "react";
import Table, { Column } from "@/components/table/table";
import { useEventos, ResponseCode } from "@/hooks";
import Loading from "@/components/loading/loading";
import { toast } from "sonner";

import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// ─── Types ─────────────────────────────────────────────────────────────────────

type EventoView = {
    id: number;
    nome: string;
    tipo: string;
    resumo: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
};

type EventoFormInput = {
    nome: string;
    tipo: string;
    resumo: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
};

// ─── Constants ──────────────────────────────────────────────────────────────────

const COLUMNS: Column<EventoView>[] = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "tipo", label: "Tipo" },
    { key: "resumo", label: "Resumo" },
    {
        key: "data",
        label: "Data",
        render: (value) => {
            const text = String(value ?? "");
            if (!text) return "-";
            const parsed = new Date(text);
            return isNaN(parsed.getTime()) ? text : parsed.toLocaleDateString("pt-BR");
        },
    },
    { key: "hora_inicio", label: "Início" },
    { key: "hora_fim",    label: "Fim"    },
];

// Paleta por tipo de evento — extensível
const TIPO_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    culto:      { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-400"   },
    reunião:    { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400" },
    reuniao:    { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400" },
    célula:     { bg: "bg-emerald-50",text: "text-emerald-600",dot: "bg-emerald-400"},
    celula:     { bg: "bg-emerald-50",text: "text-emerald-600",dot: "bg-emerald-400"},
    especial:   { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-400"  },
    treinamento:{ bg: "bg-rose-50",   text: "text-rose-600",   dot: "bg-rose-400"   },
};

const DEFAULT_COLOR = { bg: "bg-neutral-100", text: "text-neutral-500", dot: "bg-neutral-400" };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getTipoColor(tipo: string) {
    return TIPO_COLORS[tipo?.toLowerCase()] ?? DEFAULT_COLOR;
}

function formatData(iso: string) {
    if (!iso) return { diaSemana: "-", dataFmt: "-" };
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { diaSemana: "-", dataFmt: iso };
    return {
        diaSemana: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        dataFmt:   d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    };
}

function formatHora(h: string) {
    return h?.slice(0, 5) ?? "--:--";
}

function parseForm(form: Record<string, unknown>): EventoFormInput {
    return {
        nome:        String(form.nome        ?? ""),
        tipo:        String(form.tipo        ?? ""),
        resumo:      String(form.resumo      ?? ""),
        data:        String(form.data        ?? ""),
        hora_inicio: String(form.hora_inicio ?? ""),
        hora_fim:    String(form.hora_fim    ?? ""),
    };
}

// Agrupa eventos por data ISO (yyyy-mm-dd)
function groupByData(eventos: EventoView[]): Map<string, EventoView[]> {
    const map = new Map<string, EventoView[]>();
    const sorted = [...eventos].sort((a, b) => a.data.localeCompare(b.data));
    sorted.forEach((e) => {
        const key = e.data?.slice(0, 10) ?? "";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(e);
    });
    return map;
}

// ─── Agenda Item ───────────────────────────────────────────────────────────────

function AgendaItem({ evento }: { evento: EventoView }) {
    const [open, setOpen] = useState(false);
    const color = getTipoColor(evento.tipo);

    return (
        <div className="group flex gap-3 items-start">
            {/* Dot na timeline */}
            <div className="flex flex-col items-center pt-1 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full mt-1 ${color.dot}`} />
            </div>

            {/* Card */}
            <div
                className="flex-1 bg-white/60 hover:bg-white/80 border border-white/70 rounded-xl px-3.5 py-2.5 transition-all duration-150 cursor-pointer"
                onClick={() => setOpen((v) => !v)}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Badge tipo */}
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${color.bg} ${color.text}`}>
                            {evento.tipo || "—"}
                        </span>
                        <span className="text-sm font-medium text-neutral-700 truncate">
                            {evento.nome}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-neutral-400 flex items-center gap-0.5">
                            <AccessTimeOutlinedIcon style={{ fontSize: 12 }} />
                            {formatHora(evento.hora_inicio)} – {formatHora(evento.hora_fim)}
                        </span>
                        <ExpandMoreIcon
                            style={{ fontSize: 15 }}
                            className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                    </div>
                </div>

                {/* Expandido */}
                {open && evento.resumo && (
                    <p className="text-xs text-neutral-500 mt-2 pt-2 border-t border-neutral-100 leading-relaxed">
                        {evento.resumo}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Agenda Group (por data) ────────────────────────────────────────────────────

function AgendaGroup({ dataKey, eventos }: { dataKey: string; eventos: EventoView[] }) {
    const { diaSemana, dataFmt } = formatData(dataKey);
    const isHoje = dataKey === new Date().toISOString().slice(0, 10);

    return (
        <div className="flex gap-4">
            {/* Coluna de data */}
            <div className="w-14 flex-shrink-0 flex flex-col items-end pt-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${isHoje ? "text-blue-500" : "text-neutral-400"}`}>
                    {diaSemana}
                </span>
                <span className={`text-sm font-bold leading-tight ${isHoje ? "text-blue-600" : "text-neutral-600"}`}>
                    {dataFmt}
                </span>
                {isHoje && (
                    <span className="text-[9px] font-semibold text-blue-500 bg-blue-50 px-1 rounded mt-0.5">
                        hoje
                    </span>
                )}
            </div>

            {/* Linha divisória + eventos */}
            <div className="flex-1 border-l border-neutral-200 pl-4 pb-4 flex flex-col gap-2">
                {eventos.map((e) => (
                    <AgendaItem key={e.id} evento={e} />
                ))}
            </div>
        </div>
    );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function EventosPage() {
    const { data, loading, error, getAll, create, update, remove } = useEventos();
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAll();
    }, [getAll]);

    const rows = useMemo<EventoView[]>(
        () => data.map((e) => ({
            id:          e.id ?? 0,
            nome:        e.nome,
            tipo:        e.tipo,
            resumo:      e.resumo,
            data:        e.data,
            hora_inicio: e.hora_inicio,
            hora_fim:    e.hora_fim,
        })),
        [data]
    );

    const filtered = useMemo(() => {
        if (!search.trim()) return rows;
        const q = search.toLowerCase();
        return rows.filter(
            (e) =>
                e.nome?.toLowerCase().includes(q) ||
                e.tipo?.toLowerCase().includes(q) ||
                e.resumo?.toLowerCase().includes(q)
        );
    }, [rows, search]);

    const grouped = useMemo(() => groupByData(filtered), [filtered]);

    // ── Handlers ────────────────────────────────────────────────────────────────

    const onCreate = async (form: Record<string, unknown>) => {
        const result = await create(parseForm(form));
        if (result.code === ResponseCode.SUCCESS) {
            toast.success("Evento criado");
            getAll();
            return;
        }
        toast.error(result.message);
    };

    const onEdit = async (row: EventoView) => {
        const result = await update(row);
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
            getAll();
            return;
        }
        toast.error(result.message);
    };

    // ── Render ───────────────────────────────────────────────────────────────────

    if (loading) return <Loading />;
    if (error)   return <p className="p-8 text-red-500">Erro: {error}</p>;

    return (
        <div className="space-y-4">

            {/* ── Agenda ── */}
            <section className="glass-panel rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-700 flex items-center gap-2">
                            <EventNoteOutlinedIcon style={{ fontSize: 20 }} className="text-neutral-400" />
                            Agenda de Eventos
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            {rows.length} evento{rows.length !== 1 ? "s" : ""} cadastrado{rows.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Busca */}
                    <div className="relative self-start sm:self-auto">
                        <SearchOutlinedIcon
                            style={{ fontSize: 15 }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Buscar evento..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white/70 text-neutral-700 outline-none focus:border-neutral-400 w-48"
                        />
                    </div>
                </div>

                {/* Lista agrupada */}
                {grouped.size === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-neutral-400">
                        <CalendarTodayOutlinedIcon style={{ fontSize: 34 }} className="opacity-30" />
                        <p className="text-sm font-medium">
                            {search ? "Nenhum evento encontrado" : "Nenhum evento cadastrado"}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
                            >
                                Limpar busca
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {Array.from(grouped.entries()).map(([key, eventos]) => (
                            <AgendaGroup key={key} dataKey={key} eventos={eventos} />
                        ))}
                    </div>
                )}

                {/* Legenda de tipos */}
                {rows.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/50 flex flex-wrap gap-2">
                        {Array.from(new Set(rows.map((e) => e.tipo).filter(Boolean))).map((tipo) => {
                            const color = getTipoColor(tipo);
                            return (
                                <span
                                    key={tipo}
                                    className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                                >
                                    <LabelOutlinedIcon style={{ fontSize: 10 }} />
                                    {tipo}
                                </span>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── Tabela ── */}
            <section className="glass-panel rounded-xl p-3">
                <Table
                    columns={COLUMNS}
                    data={rows}
                    columnsSearch={["nome", "tipo", "resumo"]}
                    actions={[
                        { name: "Editar",    func: onEdit,   color: "#82ACAA", type: "edit"   },
                        { name: "Excluir",   func: onDelete, color: "#AC8282", type: "delete" },
                        { name: "Cadastrar", func: onCreate, color: "#82ACAA", type: "create" },
                    ]}
                    onCreate={onCreate}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    formFields={[
                        { key: "nome",        placeholder: "Nome"        },
                        { key: "tipo",        placeholder: "Tipo"        },
                        { key: "resumo",      placeholder: "Resumo"      },
                        { key: "data",        placeholder: "Data",        type: "date" },
                        { key: "hora_inicio", placeholder: "Hora Início", type: "time" },
                        { key: "hora_fim",    placeholder: "Hora Fim",    type: "time" },
                    ]}
                />
            </section>

        </div>
    );
}