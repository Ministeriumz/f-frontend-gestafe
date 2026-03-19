"use client";

import Image from "next/image";
import React from "react";
import Button from "../Button";
import Dashboard from "@mui/icons-material/Dashboard";
import { Item } from "./item";
import { useRouter } from "next/navigation";

import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EventIcon from "@mui/icons-material/Event";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ChurchIcon from "@mui/icons-material/Church";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LinkIcon from "@mui/icons-material/Link";

const items = [
  { link: "/igreja/membros", nome: "Membros", icone: <PeopleAltIcon fontSize="small" /> },
  { link: "/igreja/igrejas", nome: "Igrejas", icone: <ChurchIcon fontSize="small" /> },
  { link: "/igreja/tipos-usuario", nome: "Tipos Usuario", icone: <AdminPanelSettingsIcon fontSize="small" /> },
  { link: "/igreja/cargos", nome: "Cargos", icone: <AccountTreeIcon fontSize="small" /> },
  { link: "/igreja/ministerios", nome: "Ministerios", icone: <AccountBalanceIcon fontSize="small" /> },
  { link: "/igreja/eventos", nome: "Eventos", icone: <EventIcon fontSize="small" /> },
  { link: "/igreja/escalas", nome: "Escalas", icone: <PsychologyIcon fontSize="small" /> },
  { link: "/igreja/financeiro", nome: "Financeiro", icone: <PointOfSaleIcon fontSize="small" /> },
  { link: "/igreja/configuracoes", nome: "Configuracoes", icone: <SettingsIcon fontSize="small" /> },
  { link: "/igreja/logs", nome: "Logs", icone: <AssignmentIcon fontSize="small" /> },
  { link: "/igreja/mensagens", nome: "Mensagens", icone: <MessageIcon fontSize="small" /> },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 z-40 glass-panel border-b md:border-r border-white/50 w-full md:w-[250px] md:h-screen h-[76px]">
      <div className="hidden md:flex md:flex-col h-full p-4 gap-4">
        <div className="w-full h-fit flex items-center justify-center pt-2">
          <Image src="/gestafebranco.png" width={80} height={80} alt="logo" className="opacity-30 invert" />
        </div>

        <Button className="!h-[42px] text-sm" onClick={() => router.push("/igreja/dashboard")} icon={<Dashboard fontSize="small" />}>
          Dashboard
        </Button>

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1">
            {items.map((item, index) => (
              <Item key={item.link} index={index} item={item} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 text-neutral-600 font-semibold items-center glass-soft w-full p-2 rounded-lg">
          <div className="rounded-full p-2 bg-primary text-white">
            <PersonIcon fontSize="small" />
          </div>
          <h4 className="text-sm">Usuario</h4>
        </div>
      </div>

      <div className="md:hidden h-full flex items-center gap-2 px-3">
        <Image src="/gestafebranco.png" width={34} height={34} alt="logo" className="opacity-40 invert" />
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => router.push("/igreja/dashboard")}
              className="text-xs px-2 py-1 rounded-md glass-soft text-neutral-700"
            >
              Dashboard
            </button>
            {items.map((item, index) => (
              <Item key={item.link} index={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
