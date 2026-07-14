"use client";
//* Libraries imports

//* Libraries imports
import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

//* Types imports
import type { RoleOption, ScaleView, ShiftGroup } from "./scale-types";

type ShiftCardProps = {
  shift: ShiftGroup;
  roles: RoleOption[];
  saving: boolean;
  onAdd: (shift: ShiftGroup, roleId: number) => Promise<boolean>;
  onRequestDelete: (scale: ScaleView) => void;
};

function formatTime(value: string) { return value.slice(0, 5); }

function ShiftIcon({ hour }: { hour: string }) {
  const value = Number(hour.split(":")[0]);
  if (value < 12) return <LightModeRoundedIcon />;
  if (value < 18) return <WbSunnyRoundedIcon />;
  return <NightsStayRoundedIcon />;
}

export default function ShiftCard({ shift, roles, saving, onAdd, onRequestDelete }: ShiftCardProps) {
  const [adding, setAdding] = useState(false);
  const [roleId, setRoleId] = useState("");

  const submit = async () => {
    if (!roleId) return;
    const success = await onAdd(shift, Number(roleId));
    if (success) { setRoleId(""); setAdding(false); }
  };

  return (
    <article className="schedule-shift-card glass-panel">
      <header>
        <span className="schedule-shift-icon"><ShiftIcon hour={shift.inicio} /></span>
        <div><span>Turno</span><strong>{formatTime(shift.inicio)} — {formatTime(shift.fim)}</strong></div>
        <span className="schedule-count">{shift.scales.length}</span>
      </header>

      <div className="schedule-role-list">
        {shift.scales.map((scale) => {
          const role = roles.find((item) => item.id === scale.cargoId);
          return (
            <div key={scale.id} className="schedule-role-row">
              <span className="schedule-role-avatar">{(role?.nome ?? "C").slice(0, 1).toUpperCase()}</span>
              <div><strong>{role?.nome ?? `Cargo ${scale.cargoId}`}</strong><small>Responsabilidade confirmada</small></div>
              <button type="button" onClick={() => onRequestDelete(scale)} aria-label={`Remover ${role?.nome ?? "escala"}`}><DeleteOutlineRoundedIcon /></button>
            </div>
          );
        })}

        {shift.scales.length === 0 && <div className="schedule-empty-slot"><span>Este turno ainda não possui cargos.</span></div>}
      </div>

      {adding ? (
        <div className="schedule-inline-add">
          <select value={roleId} onChange={(event) => setRoleId(event.target.value)} autoFocus>
            <option value="">Selecione um cargo</option>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.nome}</option>)}
          </select>
          <button type="button" onClick={submit} disabled={!roleId || saving}><CheckRoundedIcon /> Adicionar</button>
          <button type="button" onClick={() => setAdding(false)}>Cancelar</button>
        </div>
      ) : (
        <button type="button" className="schedule-add-role" onClick={() => setAdding(true)}><AddRoundedIcon /> Adicionar cargo ao turno</button>
      )}
    </article>
  );
}
