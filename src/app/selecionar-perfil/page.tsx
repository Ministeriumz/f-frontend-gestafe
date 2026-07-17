"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChurchRoundedIcon from "@mui/icons-material/ChurchRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppProfile, isAuthenticated, setActiveProfile } from "@/lib/auth";

const profiles: Array<{
  id: AppProfile;
  title: string;
  description: string;
  destination: string;
  icon: React.ReactNode;
  accent: string;
}> = [
  {
    id: "igreja",
    title: "Gestao da igreja",
    description: "Administracao completa de membros, ministerios, eventos e financas.",
    destination: "/igreja/dashboard",
    icon: <ChurchRoundedIcon />,
    accent: "profile-accent-church",
  },
  {
    id: "fiel",
    title: "Sou fiel",
    description: "Acompanhe sua comunidade, agenda, avisos e sua jornada na igreja.",
    destination: "/fiel",
    icon: <Groups2RoundedIcon />,
    accent: "profile-accent-member",
  },
  {
    id: "colaborador",
    title: "Sou colaborador",
    description: "Consulte escalas, equipes e atividades em que voce esta servindo.",
    destination: "/colaborador",
    icon: <VolunteerActivismRoundedIcon />,
    accent: "profile-accent-volunteer",
  },
];

export default function ProfileSelectionPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/");
  }, [router]);

  const selectProfile = (profile: (typeof profiles)[number]) => {
    setActiveProfile(profile.id);
    router.push(profile.destination);
  };

  return (
    <main className="profile-selection-page">
      <header className="profile-selection-header">
        <Image src="/gestafepreto.png" width={72} height={72} alt="GestaFe" priority />
        <span>GestaFe</span>
      </header>

      <section className="profile-selection-content" aria-labelledby="profile-title">
        <div className="profile-selection-copy">
          <span className="profile-eyebrow">Seu espaco no GestaFe</span>
          <h1 id="profile-title">Como voce quer entrar?</h1>
          <p>Escolha o ambiente que corresponde ao que voce precisa fazer agora.</p>
        </div>

        <div className="profile-grid">
          {profiles.map((profile) => (
            <button
              type="button"
              className={`profile-card ${profile.accent}`}
              key={profile.id}
              onClick={() => selectProfile(profile)}
            >
              <span className="profile-card-icon">{profile.icon}</span>
              <span className="profile-card-text">
                <strong>{profile.title}</strong>
                <small>{profile.description}</small>
              </span>
              <span className="profile-card-arrow" aria-hidden="true"><ArrowForwardRoundedIcon /></span>
            </button>
          ))}
        </div>
      </section>

      <footer className="profile-selection-footer">Ministerium · GestaFe</footer>
    </main>
  );
}
