import type { ReactNode } from "react";

export type DayPeriod = "morning" | "day" | "night";

export type DashboardMetric = {
  label: string;
  value: number;
  description: string;
  href: string;
  icon: ReactNode;
  tone: "blue" | "green" | "amber" | "rose";
};

export type DashboardEvent = {
  id: number;
  nome: string;
  tipo: string;
  resumo: string;
  data: string;
  hora_inicio: string;
};
