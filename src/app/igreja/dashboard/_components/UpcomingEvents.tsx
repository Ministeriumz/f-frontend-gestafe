
//* Libraries imports

//* Libraries imports
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

//* Types imports
import type { DashboardEvent } from "./dashboard-types";

function parseLocalDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function UpcomingEvents({ events }: { events: DashboardEvent[] }) {
  return (
    <section className="dashboard-panel dashboard-events-panel">
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-kicker">Agenda</span>
          <h2>Próximos eventos</h2>
          <p>Os próximos compromissos da comunidade.</p>
        </div>
        <Link href="/igreja/eventos" className="dashboard-see-all">Ver calendário <ArrowForwardRoundedIcon fontSize="small" /></Link>
      </div>

      <div className="dashboard-event-list">
        {events.length === 0 ? (
          <div className="dashboard-empty-state">
            <EventAvailableRoundedIcon />
            <strong>Nenhum evento próximo</strong>
            <span>Cadastre um evento para movimentar a agenda.</span>
            <Link href="/igreja/eventos">Abrir calendário</Link>
          </div>
        ) : events.map((event) => {
          const date = parseLocalDate(event.data);
          return (
            <Link href="/igreja/eventos" key={event.id} className="dashboard-event-row">
              <div className="dashboard-event-date">
                <strong>{String(date.getDate()).padStart(2, "0")}</strong>
                <span>{date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>
              </div>
              <div className="dashboard-event-copy">
                <div><span className="dashboard-event-type">{event.tipo || "Evento"}</span><span>{event.hora_inicio.slice(0, 5)}</span></div>
                <strong>{event.nome}</strong>
                <p>{event.resumo || "Sem descrição informada."}</p>
              </div>
              <CalendarMonthRoundedIcon className="dashboard-event-arrow" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
