
//* Libraries imports

//* Libraries imports
import {
  dateFnsLocalizer,
  type EventProps,
} from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

//* Types imports
import type { CalendarEvent } from "./event-types";

const EVENT_COLORS: Record<string, { background: string; foreground: string }> = {
  culto: { background: "var(--event-culto-background)", foreground: "var(--event-culto-foreground)" },
  "reunião": { background: "var(--event-reuniao-background)", foreground: "var(--event-reuniao-foreground)" },
  reuniao: { background: "var(--event-reuniao-background)", foreground: "var(--event-reuniao-foreground)" },
  "célula": { background: "var(--event-celula-background)", foreground: "var(--event-celula-foreground)" },
  celula: { background: "var(--event-celula-background)", foreground: "var(--event-celula-foreground)" },
  especial: { background: "var(--event-especial-background)", foreground: "var(--event-especial-foreground)" },
  treinamento: { background: "var(--event-treinamento-background)", foreground: "var(--event-treinamento-foreground)" },
};

const DEFAULT_EVENT_COLOR = { background: "var(--event-default-background)", foreground: "var(--event-default-foreground)" };

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
