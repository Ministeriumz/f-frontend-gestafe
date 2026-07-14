
//* Types imports

//* Types imports
import type { EventoDTO } from "@/hooks";

export type EventoView = EventoDTO & { id: number };

export type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: EventoView;
};

export type EventForm = Omit<EventoDTO, "id">;

export type EventFilters = {
  search: string;
  tipo: string;
  startDate: string;
  endDate: string;
};

export const EMPTY_FORM: EventForm = {
  nome: "",
  tipo: "",
  resumo: "",
  data: "",
  hora_inicio: "",
  hora_fim: "",
};
