"use client";

import { useEffect, useMemo, useState } from "react";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import { getSessionUser } from "@/lib/auth";
import { StatusFinanceiro, useEventos, useFinanceiro, useMinisterios, useUsuarios } from "@/hooks";
import DashboardHero, { getDayPeriod } from "./_components/DashboardHero";
import DashboardMetricCard from "./_components/DashboardMetricCard";
import QuickAccess from "./_components/QuickAccess";
import UpcomingEvents from "./_components/UpcomingEvents";
import type { DashboardEvent, DashboardMetric } from "./_components/dashboard-types";

export default function DashboardPage() {
  const usuarios = useUsuarios();
  const ministerios = useMinisterios();
  const eventos = useEventos();
  const financeiro = useFinanceiro();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setNow(new Date());
    void Promise.all([usuarios.getAll(), ministerios.getAll(), eventos.getAll(), financeiro.getAll()]);
  }, [usuarios.getAll, ministerios.getAll, eventos.getAll, financeiro.getAll]);

  const session = getSessionUser();
  const currentUser = usuarios.data.find((user) => user.id === Number(session.userId));
  const userName = currentUser?.nome || session.email?.split("@")[0] || "bem-vindo";
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const upcomingEvents = useMemo<DashboardEvent[]>(
    () => eventos.data
      .filter((event) => event.id && event.data.slice(0, 10) >= today)
      .sort((a, b) => `${a.data}${a.hora_inicio}`.localeCompare(`${b.data}${b.hora_inicio}`))
      .slice(0, 4)
      .map((event) => ({ ...event, id: event.id as number })),
    [eventos.data, today],
  );

  const metrics: DashboardMetric[] = [
    { label: "Total de membros", value: usuarios.data.length, description: "Pessoas cadastradas", href: "/igreja/membros", icon: <GroupsRoundedIcon />, tone: "blue" },
    { label: "Ministérios", value: ministerios.data.length, description: "Áreas de atuação", href: "/igreja/ministerios", icon: <VolunteerActivismRoundedIcon />, tone: "green" },
    { label: "Próximos eventos", value: eventos.data.filter((event) => event.data.slice(0, 10) >= today).length, description: "Encontros agendados", href: "/igreja/eventos", icon: <EventRoundedIcon />, tone: "amber" },
    { label: "Pendências financeiras", value: financeiro.data.filter((item) => item.status === StatusFinanceiro.PENDENTE).length, description: "Lançamentos aguardando", href: "/igreja/financeiro", icon: <PaymentsRoundedIcon />, tone: "rose" },
  ];

  return (
    <div className="dashboard-page">
      <DashboardHero period={getDayPeriod(now)} userName={userName} date={now} />

      <div className="dashboard-metrics-grid">
        {metrics.map((metric) => <DashboardMetricCard key={metric.label} metric={metric} />)}
      </div>

      <div className="dashboard-content-grid">
        <UpcomingEvents events={upcomingEvents} />
        <QuickAccess />
      </div>
    </div>
  );
}
