"use client";

import React, { useEffect, useMemo } from "react";
import Table, { Column } from "@/components/Table/table";
import Loading from "@/components/Loading/loading";
import { ResponseCode, StatusFinanceiro, useFinanceiro, useIgrejas } from "@/hooks";
import { toast } from "sonner";

type FinanceiroView = {
  id: number;
  valor: number;
  acao: string;
  data: string;
  status: number;
  igrejaId: number;
};

const columns: Column<FinanceiroView>[] = [
  { key: "id", label: "ID" },
  { key: "valor", label: "Valor" },
  { key: "acao", label: "Acao" },
  {
    key: "data",
    label: "Data",
    render: (value) => {
      const text = String(value || "");
      if (!text) return "-";
      const parsed = new Date(text);
      return isNaN(parsed.getTime()) ? text : parsed.toLocaleDateString("pt-BR");
    },
  },
  { key: "status", label: "Status" },
  { key: "igrejaId", label: "Igreja ID" },
];

export default function FinanceiroPage() {
  const { data, loading, error, getAll, create, update, remove } = useFinanceiro();
  const { data: igrejas, getAll: getAllIgrejas } = useIgrejas();

  useEffect(() => {
    getAll();
    getAllIgrejas();
  }, [getAll, getAllIgrejas]);

  const rows = useMemo<FinanceiroView[]>(
    () =>
      data.map((item) => ({
        id: item.id || 0,
        valor: Number(item.valor),
        acao: item.acao,
        data: item.data,
        status: Number(item.status),
        igrejaId: Number(item.igrejaId),
      })),
    [data]
  );

  const summary = useMemo(() => {
    const entradas = rows.filter((item) => item.valor > 0).reduce((acc, item) => acc + item.valor, 0);
    const saidas = rows.filter((item) => item.valor < 0).reduce((acc, item) => acc + item.valor, 0);
    const pendentes = rows.filter((item) => item.status === StatusFinanceiro.PENDENTE);
    const saldo = entradas + saidas;

    const byMonth = new Map<string, number>();
    rows.forEach((item) => {
      const month = String(item.data).slice(0, 7) || "sem-data";
      byMonth.set(month, (byMonth.get(month) || 0) + item.valor);
    });

    const chart = [...byMonth.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, value]) => ({ month, value }));

    return { entradas, saidas, saldo, pendentes: pendentes.length, chart };
  }, [rows]);

  const maxChartValue = Math.max(...summary.chart.map((item) => Math.abs(item.value)), 1);

  const onCreate = async (form: any) => {
    const result = await create({
      valor: Number(form.valor || 0),
      acao: String(form.acao || ""),
      data: String(form.data || new Date().toISOString()),
      status: Number(form.status || StatusFinanceiro.PENDENTE),
      igrejaId: Number(form.igrejaId || 1),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Registro financeiro criado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onEdit = async (row: FinanceiroView) => {
    const result = await update({
      id: row.id,
      valor: Number(row.valor),
      acao: String(row.acao),
      data: String(row.data),
      status: Number(row.status) as StatusFinanceiro,
      igrejaId: Number(row.igrejaId),
    });
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Registro financeiro atualizado");
      getAll();
      return;
    }
    toast.error(result.message);
  };

  const onDelete = async (row: FinanceiroView) => {
    const result = await remove(row.id);
    if (result.code === ResponseCode.SUCCESS) {
      toast.success("Registro removido");
      return;
    }
    toast.error(result.message);
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-neutral-700">Painel Financeiro</h2>
            <p className="text-xs md:text-sm text-neutral-500">Visao de saldo, entradas, saidas e pendencias.</p>
          </div>
          <button className="px-3 py-2 rounded bg-neutral-100 text-neutral-600 text-xs md:text-sm hover:bg-neutral-200" onClick={() => getAll()}>
            Atualizar painel
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs text-emerald-700">Entradas</p>
            <p className="text-xl font-semibold text-emerald-800">R$ {summary.entradas.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p className="text-xs text-rose-700">Saidas</p>
            <p className="text-xl font-semibold text-rose-800">R$ {summary.saidas.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs text-blue-700">Saldo</p>
            <p className="text-xl font-semibold text-blue-800">R$ {summary.saldo.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-700">Pendentes</p>
            <p className="text-xl font-semibold text-amber-800">{summary.pendentes}</p>
          </div>
        </div>

        <div className="glass-soft rounded-lg p-3">
          <p className="text-sm font-semibold text-neutral-700 mb-2">Evolucao por mes</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 items-end min-h-32">
            {summary.chart.map((item) => (
              <div key={item.month} className="flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t ${item.value >= 0 ? "bg-emerald-400" : "bg-rose-400"}`}
                  style={{ height: `${Math.max((Math.abs(item.value) / maxChartValue) * 110, 10)}px` }}
                />
                <span className="text-[10px] text-neutral-500">{item.month}</span>
              </div>
            ))}
            {summary.chart.length === 0 && <div className="text-xs text-neutral-400 col-span-full">Sem dados para o grafico.</div>}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-xl p-3">
        <Table
          columns={columns}
          data={rows}
          columnsSearch={["acao", "status", "igrejaId"]}
          actions={[
            { name: "Editar", func: onEdit, color: "#82ACAA", type: "edit" },
            { name: "Excluir", func: onDelete, color: "#AC8282", type: "delete" },
            { name: "Cadastrar", func: onCreate, color: "#82ACAA", type: "create" },
          ]}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
          formFields={[
            { key: "valor", placeholder: "Valor" },
            { key: "acao", placeholder: "Acao" },
            { key: "data", placeholder: "Data", type: "date" },
            { key: "status", placeholder: "Status (1 Pago, 2 Pendente)" },
            {
              key: "igrejaId",
              placeholder: "Igreja",
              type: "search-select",
              options: igrejas.map((igreja) => ({
                label: `${igreja.nome} (${igreja.cnpj})`,
                value: igreja.id || 0,
              })),
            },
          ]}
        />
      </section>
    </div>
  );
}
