"use client";
//* Libraries imports

//* Libraries imports
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

//* Types imports
import type { DayPeriod } from "./dashboard-types";

const periodContent: Record<DayPeriod, { greeting: string; image: string }> = {
  morning: { greeting: "Bom dia", image: "/imagem-manha.png" },
  day: { greeting: "Boa tarde", image: "/imagem-dia.png" },
  night: { greeting: "Boa noite", image: "/imagem-noite.png" },
};

type DashboardHeroProps = {
  period: DayPeriod;
  userName: string;
  date: Date;
};

export function getDayPeriod(date: Date): DayPeriod {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  return "night";
}

export default function DashboardHero({ period, userName, date }: DashboardHeroProps) {
  const content = periodContent[period];
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className={`dashboard-hero dashboard-hero-${period}`}
      style={{ backgroundImage: `url(${content.image})` }}
    >
      <div className="dashboard-hero-content">
        <div className="dashboard-eyebrow">
          <GridViewRoundedIcon fontSize="small" />
          <span>Visão geral da igreja</span>
        </div>
        <h1>{content.greeting}, {userName}.</h1>
        <p className="dashboard-date">{formattedDate}</p>
        <p className="dashboard-intro">
          Acompanhe os principais indicadores e acesse rapidamente as áreas da sua gestão.
        </p>
      </div>
    </section>
  );
}
