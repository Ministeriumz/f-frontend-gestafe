"use client";
//* Libraries imports

//* Libraries imports
import { FormEvent } from "react";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

//* Types imports
import type { MessageMode, SelectOption } from "./message-types";

const MAX_LENGTH = 500;

type MessageComposerProps = {
  mode: MessageMode;
  selectedId: string;
  text: string;
  recipientCount: number;
  audienceLabel: string;
  userOptions: SelectOption[];
  typeOptions: SelectOption[];
  onModeChange: (mode: MessageMode) => void;
  onSelectedIdChange: (id: string) => void;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
};

export default function MessageComposer({ mode, selectedId, text, recipientCount, audienceLabel, userOptions, typeOptions, onModeChange, onSelectedIdChange, onTextChange, onSubmit }: MessageComposerProps) {
  const options = mode === "usuario" ? userOptions : typeOptions;
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); onSubmit(); };

  return (
    <section className="message-composer glass-panel">
      <header className="message-section-header">
        <div><span>Composição</span><h2>Nova mensagem</h2><p>Prepare o comunicado e escolha quem deverá recebê-lo.</p></div>
        <span className="message-draft-badge">Rascunho</span>
      </header>

      <form onSubmit={handleSubmit}>
        <fieldset className="message-audience-switch">
          <legend>Forma de envio</legend>
          <button type="button" className={mode === "usuario" ? "is-active" : ""} onClick={() => { onModeChange("usuario"); onSelectedIdChange(""); }}><PersonRoundedIcon /><span><strong>Individual</strong><small>Uma pessoa específica</small></span></button>
          <button type="button" className={mode === "tipo" ? "is-active" : ""} onClick={() => { onModeChange("tipo"); onSelectedIdChange(""); }}><GroupsRoundedIcon /><span><strong>Por grupo</strong><small>Todos de um tipo</small></span></button>
        </fieldset>

        <label className="message-field">
          <span>{mode === "usuario" ? "Destinatário" : "Tipo de usuário"}</span>
          <select value={selectedId} onChange={(event) => onSelectedIdChange(event.target.value)}>
            <option value="">{mode === "usuario" ? "Selecione uma pessoa" : "Selecione um grupo"}</option>
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label className="message-field message-editor">
          <span>Conteúdo da mensagem</span>
          <textarea maxLength={MAX_LENGTH} value={text} onChange={(event) => onTextChange(event.target.value)} placeholder="Escreva um comunicado claro e objetivo..." />
          <small>{text.length}/{MAX_LENGTH} caracteres</small>
        </label>

        <div className="message-send-summary">
          <div><span>Prévia do envio</span><strong>{audienceLabel || "Nenhum público selecionado"}</strong><small>{recipientCount} destinatário{recipientCount === 1 ? "" : "s"}</small></div>
          <button type="submit"><SendRoundedIcon /> Revisar e adicionar à fila</button>
        </div>
      </form>
    </section>
  );
}
