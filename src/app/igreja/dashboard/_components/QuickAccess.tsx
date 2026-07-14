
//* Libraries imports

//* Libraries imports
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";

const actions = [
  { title: "Gerenciar membros", description: "Cadastros e informações da comunidade", href: "/igreja/membros", icon: <GroupsRoundedIcon />, tone: "blue" },
  { title: "Organizar ministérios", description: "Equipes e áreas de atuação", href: "/igreja/ministerios", icon: <VolunteerActivismRoundedIcon />, tone: "green" },
  { title: "Planejar eventos", description: "Calendário e próximos encontros", href: "/igreja/eventos", icon: <EventRoundedIcon />, tone: "amber" },
  { title: "Acompanhar financeiro", description: "Entradas, saídas e pendências", href: "/igreja/financeiro", icon: <PaymentsRoundedIcon />, tone: "rose" },
];

export default function QuickAccess() {
  return (
    <section className="dashboard-quick-section">
      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-kicker">Navegação</span>
          <h2>Acesso rápido</h2>
          <p>Continue de onde precisa com um clique.</p>
        </div>
      </div>
      <div className="dashboard-quick-grid">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="dashboard-quick-card">
            <span className={`dashboard-quick-icon dashboard-tone-${action.tone}`}>{action.icon}</span>
            <span className="dashboard-quick-copy"><strong>{action.title}</strong><small>{action.description}</small></span>
            <ArrowForwardRoundedIcon className="dashboard-quick-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}
