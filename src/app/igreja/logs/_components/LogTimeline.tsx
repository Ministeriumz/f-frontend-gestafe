import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import type { ReactNode } from "react";
import type { LogEntry, LogLevel } from "./log-data";

const icons: Record<LogLevel, ReactNode> = { info: <EditNoteRoundedIcon />, success: <CheckCircleRoundedIcon />, warning: <ErrorRoundedIcon />, danger: <ShieldRoundedIcon /> };

export default function LogTimeline({ entries, loading, error }: { entries: LogEntry[]; loading: boolean; error: string | null }) {
  return <section className="log-timeline glass-panel">
    <header className="log-section-header"><div><span>Histórico recente</span><h2>Atividades do sistema</h2><p>{loading ? "Carregando registros..." : "Novas atividades aparecem automaticamente, sem recarregar a página."}</p></div><strong>{entries.length} registros</strong></header>
    {error ? <div className="log-empty"><ErrorRoundedIcon /><strong>Não foi possível carregar os registros</strong><p>{error}</p></div> : entries.length ? <div className="log-list">{entries.map((entry) => <article className={`log-entry is-${entry.level}`} key={entry.id}><div className="log-entry-marker">{icons[entry.level]}</div><div className="log-entry-body"><header><div><strong>{entry.action}</strong><span>{entry.module}</span></div><time>{entry.date} às {entry.time}</time></header><p>{entry.description}</p><footer><span className="log-avatar">{entry.user.slice(0, 1).toUpperCase()}</span><span>Realizado por <strong>{entry.user}</strong></span><code>#{String(entry.id).padStart(4, "0")}</code></footer></div></article>)}</div> : <div className="log-empty"><SearchRoundedIcon /><strong>{loading ? "Carregando registros" : "Nenhum registro encontrado"}</strong><p>{loading ? "Aguarde um instante." : "Ajuste ou limpe os filtros para visualizar outras atividades."}</p></div>}
  </section>;
}
