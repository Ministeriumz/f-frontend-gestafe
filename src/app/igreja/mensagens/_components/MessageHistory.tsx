import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import type { MessageItem } from "./message-types";

export default function MessageHistory({ items }: { items: MessageItem[] }) {
  return (
    <section className="message-history glass-panel">
      <header className="message-section-header">
        <div><span>Atividade</span><h2>Envios da sessão</h2><p>Mensagens enviadas desde que esta página foi aberta.</p></div>
        <span className="message-count-badge">{items.length}</span>
      </header>

      <div className="message-history-list">
        {items.length === 0 ? (
          <div className="message-empty-history"><CampaignRoundedIcon /><strong>Nenhuma mensagem enviada</strong><p>Os envios realizados aparecerão aqui para acompanhamento.</p></div>
        ) : items.map((item) => (
          <article key={item.id} className="message-history-card">
            <div className="message-history-icon">{item.mode === "usuario" ? <PersonRoundedIcon /> : <GroupsRoundedIcon />}</div>
            <div className="message-history-content">
              <div><span>{item.mode === "usuario" ? "Individual" : "Grupo"}</span><time>{item.createdAt}</time></div>
              <p>{item.text}</p>
              <footer><strong>{item.audienceLabel}</strong><span>{item.sent} enviado{item.sent === 1 ? "" : "s"}{item.failed ? ` · ${item.failed} falha${item.failed === 1 ? "" : "s"}` : ""}</span></footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
