"use client";
//* Libraries imports

//* Libraries imports
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

//* Components imports
import Loading from "@/components/loading/loading";
import { combineLocalDateTime, normalizeDate } from "./_components/calendar-config";
import EventCalendar from "./_components/EventCalendar";
import EventFiltersHeader from "./_components/EventFiltersHeader";
import EventModal from "./_components/EventModal";

//* Hooks imports
import { ResponseCode, useEventos } from "@/hooks";

//* Types imports
import type { CalendarEvent, EventFilters, EventoView, EventForm } from "./_components/event-types";

const EMPTY_FILTERS: EventFilters = { search: "", tipo: "", startDate: "", endDate: "" };

export default function EventosPage() {
  const { data, loading, error, getAll, create, update, remove } = useEventos();
  const [filters, setFilters] = useState<EventFilters>(EMPTY_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventoView | null>(null);
  const [newEventDate, setNewEventDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { void getAll(); }, [getAll]);

  const rows = useMemo<EventoView[]>(
    () => data.filter((event): event is EventoView => typeof event.id === "number"),
    [data],
  );

  const tipos = useMemo(
    () => Array.from(new Set(rows.map((event) => event.tipo).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase("pt-BR");
    return rows.filter((event) => {
      const eventDate = normalizeDate(event.data);
      return (
        (!query || event.nome.toLocaleLowerCase("pt-BR").includes(query) || event.resumo.toLocaleLowerCase("pt-BR").includes(query)) &&
        (!filters.tipo || event.tipo === filters.tipo) &&
        (!filters.startDate || eventDate >= filters.startDate) &&
        (!filters.endDate || eventDate <= filters.endDate)
      );
    });
  }, [rows, filters]);

  const calendarEvents = useMemo<CalendarEvent[]>(
    () => filteredRows.map((event) => ({
      id: event.id,
      title: event.nome,
      start: combineLocalDateTime(event.data, event.hora_inicio),
      end: combineLocalDateTime(event.data, event.hora_fim),
      resource: event,
    })),
    [filteredRows],
  );

  const setFilter = (field: keyof EventFilters, value: string) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const openCreate = (date = "") => {
    setSelectedEvent(null);
    setNewEventDate(date);
    setModalOpen(true);
  };

  const openEdit = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
    setModalOpen(true);
  };

  const mutate = async (action: () => Promise<{ code: ResponseCode; message: string }>, successMessage: string) => {
    if (saving) return;
    setSaving(true);
    try {
      const result = await action();
      if (result.code !== ResponseCode.SUCCESS) {
        toast.error(result.message);
        return;
      }
      toast.success(successMessage);
      setModalOpen(false);
      setSelectedEvent(null);
      await getAll();
    } catch {
      toast.error("Não foi possível concluir a operação.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = (form: EventForm) => mutate(() => create(form), "Evento criado");
  const handleUpdate = (form: EventForm) => selectedEvent
    ? mutate(() => update({ ...form, id: selectedEvent.id }), "Evento atualizado")
    : Promise.resolve();
  const handleDelete = () => selectedEvent
    ? mutate(() => remove(selectedEvent.id), "Evento removido")
    : Promise.resolve();

  if (loading && rows.length === 0) return <Loading />;
  if (error && rows.length === 0) return <p className="p-8 text-danger">Erro: {error}</p>;

  const filtersActive = Object.values(filters).some(Boolean);

  return (
    <div className="event-calendar-page space-y-4">
      <section className="glass-panel overflow-hidden rounded-2xl">
        <EventFiltersHeader
          total={rows.length}
          filteredTotal={filteredRows.length}
          tipos={tipos}
          filters={filters}
          onFilterChange={setFilter}
          onClearFilters={() => setFilters(EMPTY_FILTERS)}
          onCreate={openCreate}
        />
        <EventCalendar
          events={calendarEvents}
          tipos={tipos}
          filtersActive={filtersActive}
          onClearFilters={() => setFilters(EMPTY_FILTERS)}
          onSelectEvent={openEdit}
          onCreateEvent={openCreate}
        />
      </section>

      <EventModal
        evento={selectedEvent}
        initialDate={newEventDate}
        isOpen={modalOpen}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
