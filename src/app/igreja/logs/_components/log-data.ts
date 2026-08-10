import type { LogDTO } from "@/hooks";

export type LogLevel = "info" | "success" | "warning" | "danger";
export type LogEntry = {
  id: number;
  action: string;
  description: string;
  user: string;
  module: string;
  level: LogLevel;
  date: string;
  time: string;
  timestamp: Date;
};

const moduleMatchers: Array<[string, string]> = [
  ["whatsapp", "Mensagens"],
  ["usuario", "Membros"],
  ["eventos", "Eventos"],
  ["escala", "Escalas"],
  ["financeiro", "Financeiro"],
  ["ministerio", "Ministérios"],
  ["cargo", "Cargos"],
  ["configuracoes", "Configurações"],
  ["igreja", "Igrejas"],
  ["auth", "Segurança"],
  ["log", "Logs"],
];

const actionLabels: Record<string, string> = {
  GET: "Consulta",
  POST: "Criação",
  PUT: "Atualização",
  PATCH: "Atualização",
  DELETE: "Remoção",
};

export function mapLogEntry(log: LogDTO, users: Map<number, string>): LogEntry {
  const match = log.acao.match(/^([A-Z]+)\s+(\S+?)(?:\s+\[(\d{3})\])?$/i);
  const method = match?.[1]?.toUpperCase() ?? "AÇÃO";
  const path = match?.[2] ?? log.acao;
  const status = Number(match?.[3] ?? 200);
  const normalizedPath = path.toLocaleLowerCase("pt-BR");
  const module = moduleMatchers.find(([fragment]) => normalizedPath.includes(fragment))?.[1] ?? "Sistema";
  const level: LogLevel = status >= 500 ? "danger" : status >= 400 ? "warning" : method === "POST" ? "success" : method === "DELETE" ? "warning" : "info";
  const day = log.data.slice(0, 10);
  const wholeTime = log.hora.split(".")[0];
  const timestamp = new Date(`${day}T${wholeTime}Z`);
  const validTimestamp = Number.isNaN(timestamp.getTime()) ? new Date() : timestamp;

  return {
    id: log.id && log.id !== 0 ? log.id : Number(`${day.replaceAll("-", "")}${wholeTime.replaceAll(":", "")}`),
    action: module === "Mensagens" && method === "POST" ? "Mensagem enviada" : `${actionLabels[method] ?? method} em ${module}`,
    description: `Requisição ${method} em ${path} concluída com status ${status}.`,
    user: log.idUsuario ? users.get(log.idUsuario) ?? `Usuário #${log.idUsuario}` : "Sistema",
    module,
    level,
    date: validTimestamp.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
    time: validTimestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    timestamp: validTimestamp,
  };
}
