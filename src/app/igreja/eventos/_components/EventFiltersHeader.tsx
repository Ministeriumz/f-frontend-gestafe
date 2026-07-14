"use client";
//* Libraries imports

//* Libraries imports
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

//* Types imports
import type { EventFilters } from "./event-types";

type EventFiltersHeaderProps = {
  total: number;
  filteredTotal: number;
  tipos: string[];
  filters: EventFilters;
  onFilterChange: (field: keyof EventFilters, value: string) => void;
  onClearFilters: () => void;
  onCreate: () => void;
};

export default function EventFiltersHeader({ total, filteredTotal, tipos, filters, onFilterChange, onClearFilters, onCreate }: EventFiltersHeaderProps) {
  const filtersActive = Object.values(filters).some(Boolean);

  return (
    <div className="event-calendar-header p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <CalendarMonthRoundedIcon />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Agenda da igreja</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Calendário de Eventos</h1>
          <p className="mt-1 text-sm text-muted">
            {filteredTotal} de {total} evento{total === 1 ? "" : "s"} visível{filteredTotal === 1 ? "" : "is"}
          </p>
        </div>
        <button onClick={onCreate} className="event-primary-button self-start lg:self-auto">
          <AddRoundedIcon fontSize="small" /> Novo evento
        </button>
      </div>

      <div className="event-filter-bar mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_minmax(150px,1fr)_minmax(145px,0.8fr)_minmax(145px,0.8fr)_auto]">
        <label className="event-filter-control">
          <SearchRoundedIcon fontSize="small" />
          <input value={filters.search} onChange={(e) => onFilterChange("search", e.target.value)} placeholder="Buscar nome ou resumo" aria-label="Buscar eventos" />
        </label>
        <label className="event-filter-control">
          <select value={filters.tipo} onChange={(e) => onFilterChange("tipo", e.target.value)} aria-label="Filtrar por tipo">
            <option value="">Todos os tipos</option>
            {tipos.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="event-date-control">
          <span>De</span>
          <input type="date" value={filters.startDate} max={filters.endDate || undefined} onChange={(e) => onFilterChange("startDate", e.target.value)} aria-label="Data inicial" />
        </label>
        <label className="event-date-control">
          <span>Até</span>
          <input type="date" value={filters.endDate} min={filters.startDate || undefined} onChange={(e) => onFilterChange("endDate", e.target.value)} aria-label="Data final" />
        </label>
        <button onClick={onClearFilters} disabled={!filtersActive} className="event-clear-button" title="Limpar filtros">
          <FilterAltOffRoundedIcon fontSize="small" /> <span className="xl:hidden">Limpar filtros</span>
        </button>
      </div>
    </div>
  );
}
