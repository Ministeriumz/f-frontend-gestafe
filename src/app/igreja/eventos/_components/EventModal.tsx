"use client";

import { FormEvent, useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { normalizeDate } from "./calendar-config";
import { EMPTY_FORM, type EventoView, type EventForm } from "./event-types";

type EventModalProps = {
  evento: EventoView | null;
  initialDate: string;
  isOpen: boolean;
  saving: boolean;
  onClose: () => void;
  onCreate: (form: EventForm) => Promise<void>;
  onUpdate: (form: EventForm) => Promise<void>;
  onDelete: () => Promise<void>;
};

export default function EventModal({ evento, initialDate, isOpen, saving, onClose, onCreate, onUpdate, onDelete }: EventModalProps) {
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(evento ? {
      nome: evento.nome,
      tipo: evento.tipo,
      resumo: evento.resumo,
      data: normalizeDate(evento.data),
      hora_inicio: evento.hora_inicio.slice(0, 5),
      hora_fim: evento.hora_fim.slice(0, 5),
    } : { ...EMPTY_FORM, data: initialDate });
    setValidationError("");
  }, [evento, initialDate, isOpen]);

  const setField = (field: keyof EventForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setValidationError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.hora_fim <= form.hora_inicio) {
      setValidationError("O horário final deve ser posterior ao horário inicial.");
      return;
    }
    if (evento) await onUpdate(form);
    else await onCreate(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !saving && onClose()}>
      <form onSubmit={handleSubmit} className="event-form w-[min(680px,86vw)]">
        <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {evento ? "Detalhes do evento" : "Adicionar à agenda"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">
              {evento ? "Editar evento" : "Novo evento"}
            </h2>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="event-icon-button" aria-label="Fechar">
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="event-field sm:col-span-2">
            <span>Nome</span>
            <Input placeholder="Ex.: Culto de celebração" value={form.nome} onChange={(e) => setField("nome", e.target.value)} required disabled={saving} className="!max-w-none" />
          </label>
          <label className="event-field sm:col-span-2">
            <span>Tipo</span>
            <Input placeholder="Ex.: Culto" value={form.tipo} onChange={(e) => setField("tipo", e.target.value)} required disabled={saving} className="!max-w-none" />
          </label>
          <label className="event-field sm:col-span-2">
            <span>Resumo</span>
            <textarea placeholder="Descreva brevemente o evento" value={form.resumo} onChange={(e) => setField("resumo", e.target.value)} required disabled={saving} className="glass-input min-h-24 w-full resize-y rounded-lg p-3 text-foreground" />
          </label>
          <label className="event-field sm:col-span-2">
            <span>Data</span>
            <Input placeholder="Data" type="date" value={form.data} onChange={(e) => setField("data", e.target.value)} required disabled={saving} className="!max-w-none" />
          </label>
          <label className="event-field">
            <span>Início</span>
            <Input placeholder="Início" type="time" value={form.hora_inicio} onChange={(e) => setField("hora_inicio", e.target.value)} required disabled={saving} className="!max-w-none" />
          </label>
          <label className="event-field">
            <span>Fim</span>
            <Input placeholder="Fim" type="time" value={form.hora_fim} onChange={(e) => setField("hora_fim", e.target.value)} required disabled={saving} className="!max-w-none" />
          </label>
        </div>

        {validationError && <p className="mt-3 text-sm font-medium text-red-600">{validationError}</p>}

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-foreground/10 pt-4 sm:flex-row">
          {evento ? (
            <button type="button" onClick={onDelete} disabled={saving} className="event-danger-button">
              <DeleteOutlineRoundedIcon fontSize="small" /> Excluir
            </button>
          ) : <span />}
          <div className="flex gap-2 sm:justify-end">
            <button type="button" onClick={onClose} disabled={saving} className="event-secondary-button">Cancelar</button>
            <button type="submit" disabled={saving} className="event-primary-button">
              {saving ? "Salvando..." : evento ? "Salvar alterações" : "Criar evento"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
