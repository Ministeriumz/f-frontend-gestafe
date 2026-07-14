"use client";
//* Libraries imports

//* Libraries imports
import { useState } from "react";
import { Calendar, type EventPropGetter, type View, Views } from "react-big-calendar";

//* Components imports
import EventDateCell from "./EventDateCell";

//* Types imports
import type { CalendarEvent } from "./event-types";

//* Styles imports
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEventContent, calendarLocalizer, calendarMessages, getEventColor } from "./calendar-config";

type EventCalendarProps = {
  events: CalendarEvent[];
  tipos: string[];
  filtersActive: boolean;
  onClearFilters: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onCreateEvent: (date: string) => void;
};

export default function EventCalendar({ events, tipos, filtersActive, onClearFilters, onSelectEvent, onCreateEvent }: EventCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);

  const eventPropGetter: EventPropGetter<CalendarEvent> = (event) => {
    const color = getEventColor(event.resource.tipo);
    return { style: { backgroundColor: color.background, color: color.foreground, borderColor: color.background } };
  };

  return (
    <div className="p-3 sm:p-5">
      {events.length === 0 && filtersActive && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border-soft bg-surface-soft px-4 py-3 text-sm text-muted">
          <span>Nenhum evento corresponde aos filtros aplicados.</span>
          <button onClick={onClearFilters} className="font-semibold text-primary hover:underline">Limpar</button>
        </div>
      )}
      <div className={`event-calendar-shell ${view === Views.MONTH ? "is-month-view" : "is-time-view"}`}>
        <Calendar<CalendarEvent>
          localizer={calendarLocalizer}
          culture="pt-BR"
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          messages={calendarMessages}
          components={{
            event: CalendarEventContent,
            month: {
              dateHeader: (props) => <EventDateCell {...props} events={events} onCreateEvent={onCreateEvent} />,
            },
          }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={onSelectEvent}
          popup
          step={30}
          timeslots={2}
          min={new Date(1970, 0, 1, 6, 0)}
          max={new Date(1970, 0, 1, 23, 59)}
        />
      </div>

      {tipos.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-foreground/10 pt-4">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Tipos</span>
          {tipos.map((item) => {
            const color = getEventColor(item);
            return <span key={item} className="event-legend-item"><i style={{ backgroundColor: color.background }} />{item}</span>;
          })}
        </div>
      )}
    </div>
  );
}
