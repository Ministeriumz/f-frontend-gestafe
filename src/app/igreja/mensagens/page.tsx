"use client";

import { useEffect, useMemo, useState } from "react";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import { toast } from "sonner";

import ConfirmDialog from "@/components/dialog";
import { useTiposUsuario, useUsuarios, useWhatsAppMessages, type UsuarioDTO } from "@/hooks";
import { ResponseCode } from "@/lib/api";
import MessageComposer from "./_components/MessageComposer";
import MessageHistory from "./_components/MessageHistory";
import type { MessageItem, MessageMode, SelectOption } from "./_components/message-types";

export default function MensagensPage() {
  const { data: usuarios, getAll: getAllUsuarios } = useUsuarios();
  const { data: tipos, getAll: getAllTipos } = useTiposUsuario();
  const { send, loading: sending } = useWhatsAppMessages();
  const [mode, setMode] = useState<MessageMode>("usuario");
  const [selectedId, setSelectedId] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<MessageItem[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => { void Promise.all([getAllUsuarios(), getAllTipos()]); }, [getAllUsuarios, getAllTipos]);

  const usersByType = useMemo(() => {
    const map = new Map<number, UsuarioDTO[]>();
    usuarios.forEach((user) => map.set(user.idTipoUsuario, [...(map.get(user.idTipoUsuario) ?? []), user]));
    return map;
  }, [usuarios]);

  const userOptions = useMemo<SelectOption[]>(() => usuarios.filter((user) => user.id).map((user) => ({ value: String(user.id), label: `${user.nome} ${user.sobrenome} · ${user.email}` })), [usuarios]);
  const typeOptions = useMemo<SelectOption[]>(() => tipos.filter((tipo) => tipo.id).map((tipo) => ({ value: String(tipo.id), label: `${tipo.nome} · ${usersByType.get(tipo.id as number)?.length ?? 0} pessoas` })), [tipos, usersByType]);

  const audience = useMemo(() => {
    if (mode === "usuario") {
      const user = usuarios.find((item) => String(item.id) === selectedId);
      return { label: user ? `${user.nome} ${user.sobrenome}`.trim() : "", recipients: user ? [user] : [] };
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

  const sendMessage = async () => {
    const messageText = text.trim();
    const result = await send({
      recipients: audience.recipients.map((user) => ({ phone: user.telefone })),
      text: messageText,
    });
    if (result.code !== ResponseCode.SUCCESS || !result.data) {
      toast.error(result.message || "Não foi possível enviar a mensagem");
      return;
    }
    const delivery = result.data;

    setItems((current) => [{
      id: Date.now(),
      text: messageText,
      mode,
      audienceLabel: audience.label,
      recipients: audience.recipients.map((user) => `${user.nome} ${user.sobrenome}`.trim()),
      sent: delivery.sent,
      failed: delivery.failed,
      createdAt: new Date().toLocaleString("pt-BR"),
    }, ...current]);
    setText("");

    if (delivery.failed) {
      toast.warning(`${delivery.sent} envio(s) concluído(s) e ${delivery.failed} com falha`);
    } else {
      toast.success(`Mensagem enviada para ${delivery.sent} destinatário(s)`);
    }
  };

  return (
    <div className="message-page">
      <section className="message-hero glass-panel"><span><MarkEmailUnreadRoundedIcon /></span><div><p>Comunicação da comunidade</p><h1>Central de mensagens</h1><small>Envie comunicados individuais ou para grupos e acompanhe os envios desta sessão.</small></div></section>
      <div className="message-layout">
        <MessageComposer mode={mode} selectedId={selectedId} text={text} recipientCount={audience.recipients.length} audienceLabel={audience.label} userOptions={userOptions} typeOptions={typeOptions} loading={sending} onModeChange={setMode} onSelectedIdChange={setSelectedId} onTextChange={setText} onSubmit={reviewMessage} />
        <MessageHistory items={items} />
      </div>
      <ConfirmDialog isOpen={confirmOpen} title="Enviar mensagem agora?" description={`O comunicado será enviado para ${audience.recipients.length} destinatário(s) de “${audience.label}”.`} confirmLabel="Enviar mensagem" loading={sending} onCancel={() => setConfirmOpen(false)} onConfirm={sendMessage} />
    </div>
  );
}
