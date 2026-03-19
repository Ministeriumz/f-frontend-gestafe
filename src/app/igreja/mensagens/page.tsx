"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useTiposUsuario, useUsuarios } from "@/hooks";
import { toast } from "sonner";

type MessageItem = {
  id: number;
  text: string;
  mode: "usuario" | "tipo";
  recipients: string[];
  createdAt: string;
};

export default function MensagensPage() {
  const { data: usuarios, getAll: getAllUsuarios } = useUsuarios();
  const { data: tipos, getAll: getAllTipos } = useTiposUsuario();

  const [mode, setMode] = useState<"usuario" | "tipo">("usuario");
  const [selectedUsuarioId, setSelectedUsuarioId] = useState("");
  const [selectedTipoId, setSelectedTipoId] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<MessageItem[]>([]);

  useEffect(() => {
    getAllUsuarios();
    getAllTipos();
  }, [getAllUsuarios, getAllTipos]);

  const usuariosByTipo = useMemo(() => {
    const map = new Map<number, string[]>();
    usuarios.forEach((user) => {
      const key = user.idTipoUsuario;
      const current = map.get(key) || [];
      current.push(`${user.nome} ${user.sobrenome}`.trim());
      map.set(key, current);
    });
    return map;
  }, [usuarios]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();

    if (!text.trim()) {
      toast.error("Escreva uma mensagem");
      return;
    }

    let recipients: string[] = [];
    if (mode === "usuario") {
      const user = usuarios.find((item) => String(item.id) === selectedUsuarioId);
      if (!user) {
        toast.error("Selecione um usuario");
        return;
      }
      recipients = [`${user.nome} ${user.sobrenome}`.trim()];
    } else {
      const tipoId = Number(selectedTipoId);
      recipients = usuariosByTipo.get(tipoId) || [];
      if (recipients.length === 0) {
        toast.error("Esse tipo nao possui usuarios");
        return;
      }
    }

    const item: MessageItem = {
      id: Date.now(),
      text: text.trim(),
      mode,
      recipients,
      createdAt: new Date().toLocaleString(),
    };

    setItems((prev) => [item, ...prev]);
    setText("");
    toast.success(`Mensagem adicionada para ${recipients.length} destinatario(s)`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <section className="lg:col-span-2 glass-panel rounded-xl p-4">
        <h2 className="text-lg font-semibold text-neutral-700">Nova Mensagem</h2>
        <p className="text-sm text-neutral-500 mb-4">Selecione envio unitario ou por tipo de usuario.</p>

        <form onSubmit={sendMessage} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("usuario")}
              className={`px-3 py-2 rounded text-sm ${mode === "usuario" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              Usuario
            </button>
            <button
              type="button"
              onClick={() => setMode("tipo")}
              className={`px-3 py-2 rounded text-sm ${mode === "tipo" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              Tipo de Usuario
            </button>
          </div>

          {mode === "usuario" ? (
            <select
              className="w-full p-2 rounded glass-input text-sm"
              value={selectedUsuarioId}
              onChange={(event) => setSelectedUsuarioId(event.target.value)}
            >
              <option value="">Selecione o usuario</option>
              {usuarios.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.nome} {user.sobrenome} ({user.email})
                </option>
              ))}
            </select>
          ) : (
            <select
              className="w-full p-2 rounded glass-input text-sm"
              value={selectedTipoId}
              onChange={(event) => setSelectedTipoId(event.target.value)}
            >
              <option value="">Selecione o tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={String(tipo.id)}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          )}

          <textarea
            className="w-full min-h-32 p-3 rounded glass-input text-sm"
            placeholder="Escreva a mensagem..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          <button type="submit" className="w-full py-2 rounded bg-primary text-white hover:opacity-90">
            Enviar para fila
          </button>
        </form>
      </section>

      <section className="lg:col-span-3 glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-700">Listagem de Mensagens</h2>
          <span className="text-xs text-neutral-500">{items.length} itens</span>
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-auto">
          {items.map((item) => (
            <div key={item.id} className="glass-soft rounded-lg p-3">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] uppercase rounded bg-neutral-200 text-neutral-700 px-2 py-1">{item.mode}</span>
                <span className="text-xs text-neutral-500">{item.createdAt}</span>
              </div>
              <p className="text-sm text-neutral-700 mb-2">{item.text}</p>
              <div className="text-xs text-neutral-500">
                Destinatarios: {item.recipients.join(", ")}
              </div>
            </div>
          ))}

          {items.length === 0 && <div className="text-sm text-neutral-400 p-4 border border-dashed border-neutral-300 rounded">Nenhuma mensagem enviada ainda.</div>}
        </div>
      </section>
    </div>
  );
}
