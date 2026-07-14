"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { DateHeaderProps } from "react-big-calendar";
import { formatLocalDate } from "./calendar-config";
import type { CalendarEvent } from "./event-types";

type EventDateCellProps = DateHeaderProps & {
  events: CalendarEvent[];
  onCreateEvent: (date: string) => void;
};

export default function EventDateCell({ date, label, isOffRange, onDrillDown, events, onCreateEvent }: EventDateCellProps) {
  const dateKey = formatLocalDate(date);
  const hasEvents = events.some((event) => formatLocalDate(event.start) === dateKey);

  const handleCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onCreateEvent(dateKey);
  };

  return (
    <div className={`event-date-cell-header ${hasEvents ? "has-events" : "is-empty"}`}>
      <button type="button" className="event-day-number" onClick={onDrillDown} tabIndex={isOffRange ? -1 : 0}>
        {label}
      </button>
      {!isOffRange && (
        <button type="button" className="event-cell-create text-neutral-500 text-xs cursor-pointer" onClick={handleCreate} aria-label={`Criar evento em ${date.toLocaleDateString("pt-BR")}`}>
          <AddRoundedIcon />
          <span>Novo Evento</span>
        </button>
      )}
    </div>
  );
}
