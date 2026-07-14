import {
  dateFnsLocalizer,
  type EventProps,
} from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEvent } from "./event-types";

const EVENT_COLORS: Record<string, { background: string; foreground: string }> = {
  culto: { background: "#477f9d", foreground: "#f7fbfd" },
  "reunião": { background: "#7667a8", foreground: "#fbfaff" },
  reuniao: { background: "#7667a8", foreground: "#fbfaff" },
  "célula": { background: "#4f8a70", foreground: "#f5fcf8" },
  celula: { background: "#4f8a70", foreground: "#f5fcf8" },
  especial: { background: "#b07838", foreground: "#fffaf2" },
  treinamento: { background: "#a85f67", foreground: "#fff8f8" },
};

const DEFAULT_EVENT_COLOR = { background: "#5f7775", foreground: "#f7fbfa" };

export const calendarLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales: { "pt-BR": ptBR },
});

export const calendarMessages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Horário",
  event: "Evento",
  noEventsInRange: "Nenhum evento neste período.",
  showMore: (total: number) => `+ ${total} evento${total === 1 ? "" : "s"}`,
};

export function normalizeDate(value: string) {
  return value.slice(0, 10);
}

export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function combineLocalDateTime(date: string, time: string) {
  const [year, month, day] = normalizeDate(date).split("-").map(Number);
  const [hour, minute, second = 0] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

export function getEventColor(tipo: string) {
  return EVENT_COLORS[tipo.trim().toLocaleLowerCase("pt-BR")] ?? DEFAULT_EVENT_COLOR;
}

export function CalendarEventContent({ event }: EventProps<CalendarEvent>) {
  return (
    <span className="event-calendar-label">
      <strong>{event.title}</strong>
      <small>
        {event.resource.hora_inicio.slice(0, 5)}–{event.resource.hora_fim.slice(0, 5)}
      </small>
    </span>
  );
}
