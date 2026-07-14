"use client";
//* Libraries imports

//* Libraries imports
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

type ScaleHeaderProps = {
  selectedDate: string;
  assignments: number;
  shifts: number;
  onDateChange: (date: string) => void;
  onMoveDate: (days: number) => void;
  onToday: () => void;
};

function displayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

export default function ScaleHeader({ selectedDate, assignments, shifts, onDateChange, onMoveDate, onToday }: ScaleHeaderProps) {
  return (
    <section className="schedule-hero glass-panel">
      <div className="schedule-hero-copy">
        <div className="schedule-kicker"><CalendarMonthRoundedIcon fontSize="small" /><span>Organização ministerial</span></div>
        <h1>Escalas de serviço</h1>
        <p>Organize cargos e horários de cada encontro em uma visão simples do dia.</p>
      </div>

      <div className="schedule-date-panel">
        <span>Data selecionada</span>
        <strong>{displayDate(selectedDate)}</strong>
        <div className="schedule-date-controls">
          <button type="button" onClick={() => onMoveDate(-1)} aria-label="Dia anterior"><ChevronLeftRoundedIcon /></button>
          <button type="button" onClick={onToday}>Hoje</button>
          <input type="date" value={selectedDate} onChange={(event) => onDateChange(event.target.value)} aria-label="Selecionar data da escala" />
          <button type="button" onClick={() => onMoveDate(1)} aria-label="Próximo dia"><ChevronRightRoundedIcon /></button>
        </div>
      </div>

      <div className="schedule-summary-grid">
        <div><span className="schedule-summary-icon"><GroupsRoundedIcon /></span><p><strong>{assignments}</strong><small>escala{assignments === 1 ? "" : "s"} no dia</small></p></div>
        <div><span className="schedule-summary-icon"><ScheduleRoundedIcon /></span><p><strong>{shifts}</strong><small>turno{shifts === 1 ? "" : "s"} organizado{shifts === 1 ? "" : "s"}</small></p></div>
      </div>
    </section>
  );
}
