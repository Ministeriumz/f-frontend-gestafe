"use client";
//* Libraries imports

//* Libraries imports
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

//* Components imports
import ConfirmDialog from "@/components/dialog";

//* Hooks imports
import { ResponseCode, useConfiguracoes } from "@/hooks";

export default function ConfiguracoesPage() {
  const { getById, create, update, remove, loading } = useConfiguracoes();

  const [igrejaId, setIgrejaId] = useState("1");
  const [json, setJson] = useState("{\"tema\":\"claro\"}");
  const [resultado, setResultado] = useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const buscar = async () => {
    const result = await getById(Number(igrejaId));
    if (result.code === ResponseCode.SUCCESS) {
      setResultado(result.data);
      setJson(result.data?.configuracaoJson || "{}");
      toast.success("Configuracao carregada");
      return;
    }
    toast.error(result.message);
  };

  const criar = async (event: FormEvent) => {
    event.preventDefault();
    const result = await create({
      igrejaId: Number(igrejaId),
      configuracaoJson: json,
    });
    if (result.code === ResponseCode.SUCCESS) {
      setResultado(result.data);
      toast.success("Configuracao criada");
      return;
    }
    toast.error(result.message);
  };

  const atualizar = async () => {
    const result = await update({
      igrejaId: Number(igrejaId),
      configuracaoJson: json,
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Configuracao atualizada");
      return;
    }
    toast.error(result.message);
  };

  const excluir = async () => {
    const result = await remove(Number(igrejaId));
    if (result.code === ResponseCode.SUCCESS) {
      setResultado(null);
      toast.success("Configuracao removida");
      return;
    }
    toast.error(result.message);
  };

  return (
    <>
    <form onSubmit={criar} className="bg-surface-solid rounded-xl p-5 border border-border-soft shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-muted">Igreja ID</label>
          <input
            className="bg-surface-soft rounded px-3 py-2"
            value={igrejaId}
            onChange={(e) => setIgrejaId(e.target.value)}
            type="number"
            required
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-muted">Configuracao JSON</label>
        <textarea
          className="bg-surface-soft rounded px-3 py-2 min-h-40"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="px-4 py-2 rounded bg-primary text-on-primary">
          Criar
        </button>
        <button type="button" className="px-4 py-2 rounded bg-info text-on-primary" onClick={atualizar} disabled={loading}>
          Atualizar
        </button>
        <button type="button" className="px-4 py-2 rounded bg-surface-inverse text-inverse" onClick={buscar} disabled={loading}>
          Buscar
        </button>
        <button type="button" className="px-4 py-2 rounded bg-danger text-on-primary" onClick={() => setConfirmDeleteOpen(true)} disabled={loading}>
          Excluir
        </button>
      </div>

      {resultado && (
        <pre className="bg-surface-inverse text-on-primary text-sm rounded p-3 overflow-auto">
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </form>
    <ConfirmDialog
      isOpen={confirmDeleteOpen}
      title="Excluir esta configuração?"
      description={`A configuração vinculada à igreja ${igrejaId} será removida permanentemente.`}
      confirmLabel="Excluir configuração"
      loading={loading}
      onCancel={() => setConfirmDeleteOpen(false)}
      onConfirm={excluir}
    />
    </>
  );
}

