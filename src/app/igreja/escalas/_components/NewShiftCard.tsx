"use client";
//* Libraries imports

//* Libraries imports
import AddAlarmRoundedIcon from "@mui/icons-material/AddAlarmRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

//* Types imports
import type { NewShiftInput, RoleOption } from "./scale-types";

type NewShiftCardProps = {
  open: boolean;
  value: NewShiftInput;
  roles: RoleOption[];
  saving: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (field: keyof NewShiftInput, value: string) => void;
  onSubmit: () => void;
};

export default function NewShiftCard({ open, value, roles, saving, onOpen, onClose, onChange, onSubmit }: NewShiftCardProps) {
  if (!open) return (
    <button type="button" className="schedule-new-shift-trigger" onClick={onOpen}>
      <span><AddAlarmRoundedIcon /></span>
      <strong>Criar novo turno</strong>
      <small>Defina um horário e o primeiro cargo da escala.</small>
    </button>
  );

  return (
    <section className="schedule-new-shift glass-panel">
      <header><div><span>Novo horário</span><h2>Criar turno e escala</h2></div><button type="button" onClick={onClose} aria-label="Fechar"><CloseRoundedIcon /></button></header>
      <div className="schedule-new-fields">
        <label><span>Início</span><input type="time" value={value.horaInicio} onChange={(event) => onChange("horaInicio", event.target.value)} /></label>
        <label><span>Fim</span><input type="time" value={value.horaFim} onChange={(event) => onChange("horaFim", event.target.value)} /></label>
        <label><span>Primeiro cargo</span><select value={value.cargoId} onChange={(event) => onChange("cargoId", event.target.value)}><option value="">Selecione</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.nome}</option>)}</select></label>
      </div>
      <button type="button" className="schedule-create-button" onClick={onSubmit} disabled={saving}>{saving ? "Criando..." : "Criar turno"}</button>
    </section>
  );
}
