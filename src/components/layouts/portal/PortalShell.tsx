"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { isAuthenticated } from "@/lib/auth";

type PortalShellProps = {
  profile: "fiel" | "colaborador";
};

const copy = {
  fiel: {
    label: "Espaco do fiel",
    title: "Bem-vindo a sua comunidade",
    description: "Este ambiente esta sendo preparado para reunir sua agenda, avisos e informacoes da igreja.",
  },
  colaborador: {
    label: "Espaco do colaborador",
    title: "Tudo pronto para servir",
    description: "Este ambiente esta sendo preparado para reunir suas escalas, equipes e proximas atividades.",
  },
};

export default function PortalShell({ profile }: PortalShellProps) {
  const router = useRouter();
  const content = copy[profile];

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/");
  }, [router]);

  return (
    <main className={`portal-shell portal-${profile}`}>
      <aside className="portal-sidebar">
        <div className="portal-brand"><Image src="/gestafepreto.png" width={46} height={46} alt="GestaFe" /><strong>GestaFe</strong></div>
        <nav aria-label="Navegacao principal">
          <button type="button" className="active" title="Inicio"><HomeRoundedIcon /><span>Inicio</span></button>
          <button type="button" title="Agenda"><CalendarMonthRoundedIcon /><span>Agenda</span></button>
          <button type="button" title="Avisos"><NotificationsNoneRoundedIcon /><span>Avisos</span></button>
          <button type="button" title="Perfil"><PersonOutlineRoundedIcon /><span>Meu perfil</span></button>
        </nav>
        <button type="button" className="portal-switch" onClick={() => router.push("/selecionar-perfil")}>
          <ArrowBackRoundedIcon /><span>Trocar perfil</span>
        </button>
      </aside>

      <section className="portal-main">
        <header className="portal-topbar"><span>{content.label}</span><div className="portal-avatar">GF</div></header>
        <div className="portal-empty-state">
          <span className="portal-empty-icon">{profile === "fiel" ? <HomeRoundedIcon /> : <CalendarMonthRoundedIcon />}</span>
          <p>{content.label}</p>
          <h1>{content.title}</h1>
          <div>{content.description}</div>
          <span className="portal-status">Em desenvolvimento</span>
        </div>
      </section>
    </main>
  );
}
