"use client";
//* Libraries imports

//* Libraries imports
import { useEffect, useMemo, useState } from "react";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import { toast } from "sonner";

//* Components imports
import ConfirmDialog from "@/components/dialog";
import MessageComposer from "./_components/MessageComposer";
import MessageHistory from "./_components/MessageHistory";

//* Hooks imports
import { useTiposUsuario, useUsuarios } from "@/hooks";

//* Types imports
import type { MessageItem, MessageMode, SelectOption } from "./_components/message-types";

export default function MensagensPage() {
  const { data: usuarios, getAll: getAllUsuarios } = useUsuarios();
  const { data: tipos, getAll: getAllTipos } = useTiposUsuario();
  const [mode, setMode] = useState<MessageMode>("usuario");
  const [selectedId, setSelectedId] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<MessageItem[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => { void Promise.all([getAllUsuarios(), getAllTipos()]); }, [getAllUsuarios, getAllTipos]);

  const usersByType = useMemo(() => {
    const map = new Map<number, string[]>();
    usuarios.forEach((user) => map.set(user.idTipoUsuario, [...(map.get(user.idTipoUsuario) ?? []), `${user.nome} ${user.sobrenome}`.trim()]));
    return map;
  }, [usuarios]);

  const userOptions = useMemo<SelectOption[]>(() => usuarios.filter((user) => user.id).map((user) => ({ value: String(user.id), label: `${user.nome} ${user.sobrenome} · ${user.email}` })), [usuarios]);
  const typeOptions = useMemo<SelectOption[]>(() => tipos.filter((tipo) => tipo.id).map((tipo) => ({ value: String(tipo.id), label: `${tipo.nome} · ${usersByType.get(tipo.id as number)?.length ?? 0} pessoas` })), [tipos, usersByType]);

  const audience = useMemo(() => {
    if (mode === "usuario") {
      const user = usuarios.find((item) => String(item.id) === selectedId);
      return { label: user ? `${user.nome} ${user.sobrenome}`.trim() : "", recipients: user ? [`${user.nome} ${user.sobrenome}`.trim()] : [] };
    }
    const type = tipos.find((item) => String(item.id) === selectedId);
    return { label: type?.nome ?? "", recipients: usersByType.get(Number(selectedId)) ?? [] };
  }, [mode, selectedId, usuarios, tipos, usersByType]);

  const reviewMessage = () => {
    if (!selectedId) { toast.error("Selecione o público da mensagem"); return; }
    if (!text.trim()) { toast.error("Escreva uma mensagem"); return; }
    if (!audience.recipients.length) { toast.error("O público selecionado não possui usuários"); return; }
    setConfirmOpen(true);
  };

  const enqueueMessage = () => {
    setItems((current) => [{ id: Date.now(), text: text.trim(), mode, audienceLabel: audience.label, recipients: audience.recipients, createdAt: new Date().toLocaleString("pt-BR") }, ...current]);
    setText("");
    toast.success(`Mensagem adicionada para ${audience.recipients.length} destinatário(s)`);
  };

  return (
    <div className="message-page">
      <section className="message-hero glass-panel"><span><MarkEmailUnreadRoundedIcon /></span><div><p>Comunicação da comunidade</p><h1>Central de mensagens</h1><small>Prepare comunicados individuais ou para grupos e acompanhe a fila desta sessão.</small></div></section>
      <div className="message-layout">
        <MessageComposer mode={mode} selectedId={selectedId} text={text} recipientCount={audience.recipients.length} audienceLabel={audience.label} userOptions={userOptions} typeOptions={typeOptions} onModeChange={setMode} onSelectedIdChange={setSelectedId} onTextChange={setText} onSubmit={reviewMessage} />
        <MessageHistory items={items} />
      </div>
      <ConfirmDialog isOpen={confirmOpen} title="Adicionar mensagem à fila?" description={`O comunicado será preparado para ${audience.recipients.length} destinatário(s) de “${audience.label}”.`} confirmLabel="Adicionar à fila" onCancel={() => setConfirmOpen(false)} onConfirm={enqueueMessage} />
    </div>
  );
}
