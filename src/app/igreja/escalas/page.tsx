"use client";

import { useState } from "react";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import { toast } from "sonner";
import { ResponseCode, useEscalas } from "@/hooks";
import type { DiaEscalaAutomatica } from "@/hooks/useEscalas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const WEEK_DAYS = [
  { value: 0, label: "Dom" }, { value: 1, label: "Seg" }, { value: 2, label: "Ter" },
  { value: 3, label: "Qua" }, { value: 4, label: "Qui" }, { value: 5, label: "Sex" }, { value: 6, label: "Sáb" },
];

function isoDate(date: Date) { return date.toISOString().slice(0, 10); }
function addDays(date: Date, days: number) { const next = new Date(date); next.setDate(next.getDate() + days); return next; }
function displayDate(date: string) { return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }); }

export default function EscalasPage() {
  const today = new Date();
  const { gerarAutomatica, loading } = useEscalas();
  const [dataInicio, setDataInicio] = useState(isoDate(today));
  const [dataFim, setDataFim] = useState(isoDate(addDays(today, 30)));
  const [diasDaSemana, setDiasDaSemana] = useState<number[]>([0]);
  const [resultado, setResultado] = useState<DiaEscalaAutomatica[]>([]);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const toggleDay = (day: number) => setDiasDaSemana((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  const gerar = async () => {
    if (dataFim < dataInicio) { toast.error("A data final precisa ser posterior à data inicial."); return; }
    const response = await gerarAutomatica({ dataInicio, dataFim, diasDaSemana });
    if (response.code !== ResponseCode.SUCCESS || !response.data) {
      if (response.message.includes("Nenhum usuário atrelado a cargos foi encontrado")) {
        setShowSetupModal(true);
        return;
      }
      toast.error(response.message || "Não foi possível gerar a escala.");
      return;
    }
    setResultado(response.data);
    toast.success("Escala automática gerada com sucesso.");
  };

  return <div className="schedule-page auto-scale-page">
    <section className="schedule-hero glass-panel">
      <div className="schedule-hero-copy"><div className="schedule-kicker"><AutoAwesomeRoundedIcon fontSize="small" /><span>Planejamento inteligente</span></div><h1>Gerar escala automática</h1><p>Distribua cada cargo entre os voluntários da sua igreja, com equilíbrio e sem duplicar uma pessoa no mesmo dia.</p></div>
      <div className="auto-scale-status"><EventAvailableRoundedIcon /><div><span>Período selecionado</span><strong>{dataInicio.split("-").reverse().join("/")} — {dataFim.split("-").reverse().join("/")}</strong><small>{diasDaSemana.length ? `${diasDaSemana.length} dia(s) da semana` : "Todos os dias da semana"}</small></div></div>
    </section>
    <section className="auto-scale-form glass-panel">
      <div className="auto-scale-title"><div><span>Configuração</span><h2>Como deseja montar a escala?</h2></div><p>A geração considera os cargos e vínculos de voluntários já cadastrados.</p></div>
      <div className="auto-scale-fields"><label><span>Data inicial</span><input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} /></label><label><span>Data final</span><input type="date" min={dataInicio} value={dataFim} onChange={(e) => setDataFim(e.target.value)} /></label></div>
      <div className="auto-scale-days"><span>Reuniões em quais dias?</span><div>{WEEK_DAYS.map((day) => <button key={day.value} type="button" className={diasDaSemana.includes(day.value) ? "active" : ""} onClick={() => toggleDay(day.value)}>{day.label}</button>)}</div><small>Sem seleção significa gerar para todos os dias do período.</small></div>
      <button className="auto-scale-generate" type="button" disabled={loading} onClick={gerar}><AutoAwesomeRoundedIcon />{loading ? "Gerando distribuição..." : "Gerar escala automática"}</button>
    </section>
    {resultado.length > 0 && <section className="auto-scale-result"><div className="schedule-section-heading"><div><span>Escala automática gerada</span><h2>Distribuição gerada</h2></div><p>{resultado.length} encontro(s) planejado(s).</p></div><div className="auto-scale-days-grid">{resultado.map((dia) => <DayCard key={dia.data} dia={dia} />)}</div></section>}
    <SetupRequiredModal open={showSetupModal} onOpenChange={setShowSetupModal} />
  </div>;
}

function SetupRequiredModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg gap-5 p-0" showCloseButton={false}>
      <div className="border-b border-border bg-primary/5 px-6 py-5">
        <div className="mb-3 grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><AutoAwesomeRoundedIcon /></div>
        <DialogHeader><DialogTitle className="text-xl">A escala ainda precisa de uma equipe</DialogTitle><DialogDescription>Não encontramos voluntários vinculados a cargos. Por isso, a geração automática não tem quem distribuir nas responsabilidades.</DialogDescription></DialogHeader>
      </div>
      <div className="px-6">
        <p className="mb-3 text-sm font-medium text-foreground">Para liberar a geração, conclua estes passos:</p>
        <ol className="space-y-3">
          <li className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold">1</span><div><p className="flex items-center gap-1 text-sm font-medium"><BadgeRoundedIcon fontSize="small" /> Cadastre cargos</p><p className="text-xs leading-relaxed text-muted-foreground">Defina as responsabilidades da sua igreja, como recepção, mídia, louvor ou som.</p></div></li>
          <li className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold">2</span><div><p className="flex items-center gap-1 text-sm font-medium"><GroupAddRoundedIcon fontSize="small" /> Cadastre os membros</p><p className="text-xs leading-relaxed text-muted-foreground">Inclua os voluntários que poderão servir nos encontros.</p></div></li>
          <li className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold">3</span><div><p className="flex items-center gap-1 text-sm font-medium"><AssignmentIndRoundedIcon fontSize="small" /> Vincule cada membro a um cargo</p><p className="text-xs leading-relaxed text-muted-foreground">É esse vínculo que informa ao sistema quais pessoas podem ser escaladas em cada função.</p></div></li>
        </ol>
      </div>
      <DialogFooter className="px-6"><DialogClose render={<Button variant="outline" />}>Agora não</DialogClose><Button render={<Link href="/igreja/membros" />}>Ir para membros</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function DayCard({ dia }: { dia: DiaEscalaAutomatica }) {
  return <article className="auto-scale-day glass-panel"><header><div><span>{displayDate(dia.data)}</span><strong>{dia.alocacoes.length} cargo(s)</strong></div><CheckCircleOutlineRoundedIcon /></header><div>{dia.alocacoes.map((alocacao, index) => <div className="auto-scale-assignment" key={`${alocacao.cargo}-${index}`}><span>{alocacao.cargo.slice(0, 1).toUpperCase()}</span><p><strong>{alocacao.cargo}</strong><small>{alocacao.usuario === "Sem voluntários disponíveis" ? <><PersonOffRoundedIcon fontSize="inherit" /> Sem voluntário disponível</> : alocacao.usuario}</small></p></div>)}</div></article>;
}
