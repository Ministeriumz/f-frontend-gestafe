"use client";

import { useEffect, useMemo, useState } from "react";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import { useLogs, useUsuarios } from "@/hooks";
import LogFilters from "./_components/LogFilters";
import LogTimeline from "./_components/LogTimeline";
import { mapLogEntry } from "./_components/log-data";

const connectionLabels = {
  connecting: ["Conectando", "Abrindo canal em tempo real"],
  connected: ["Tempo real ativo", "Recebendo novas atividades"],
  reconnecting: ["Reconectando", "Restabelecendo o canal"],
  disconnected: ["Canal desconectado", "Nova tentativa em instantes"],
} as const;

export default function LogsPage() {
  const { data: logs, getAll: getAllLogs, loading, error, connectionState } = useLogs();
  const { data: users, getAll: getAllUsers } = useUsuarios();
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => { void Promise.all([getAllLogs(), getAllUsers()]); }, [getAllLogs, getAllUsers]);

  const userNames = useMemo(() => new Map(users.filter((user) => user.id).map((user) => [user.id as number, `${user.nome} ${user.sobrenome}`.trim()])), [users]);
  const allEntries = useMemo(() => logs.map((log) => mapLogEntry(log, userNames)).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()), [logs, userNames]);
  const modules = useMemo(() => [...new Set(allEntries.map((entry) => entry.module))].sort((a, b) => a.localeCompare(b, "pt-BR")), [allEntries]);
  const entries = useMemo(() => allEntries.filter((entry) => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return (!term || `${entry.action} ${entry.description} ${entry.user}`.toLocaleLowerCase("pt-BR").includes(term)) && (!module || entry.module === module) && (!level || entry.level === level);
  }), [allEntries, search, module, level]);

  const today = new Date();
  const todayEntries = allEntries.filter((entry) => entry.timestamp.toDateString() === today.toDateString());
  const activeUsers = new Set(todayEntries.map((entry) => entry.user).filter((user) => user !== "Sistema")).size;
  const alerts = todayEntries.filter((entry) => entry.level === "warning" || entry.level === "danger").length;
  const clear = () => { setSearch(""); setModule(""); setLevel(""); };
  const [connectionTitle, connectionDescription] = connectionLabels[connectionState];

  return <main className="logs-page">
    <section className="logs-hero glass-panel"><span><AssignmentRoundedIcon /></span><div><p>Auditoria e segurança</p><h1>Registro de atividades</h1><small>Acompanhe alterações importantes e mantenha uma visão clara do uso da plataforma.</small></div><div className={`logs-demo-badge is-${connectionState}`}><BoltRoundedIcon /><span><strong>{connectionTitle}</strong><small>{connectionDescription}</small></span></div></section>
    <section className="log-summary" aria-label="Resumo de atividades"><article className="glass-panel"><span><BoltRoundedIcon /></span><div><small>Atividades hoje</small><strong>{todayEntries.length}</strong><p>Movimentações registradas</p></div></article><article className="glass-panel"><span><PeopleAltRoundedIcon /></span><div><small>Usuários ativos</small><strong>{activeUsers}</strong><p>Responsáveis por ações</p></div></article><article className="glass-panel"><span><SecurityRoundedIcon /></span><div><small>Alertas</small><strong>{alerts}</strong><p>Ocorrências para revisar</p></div></article></section>
    <LogFilters search={search} module={module} level={level} modules={modules} onSearchChange={setSearch} onModuleChange={setModule} onLevelChange={setLevel} onClear={clear} />
    <LogTimeline entries={entries} loading={loading} error={error} />
  </main>;
}
