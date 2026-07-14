"use client";
//* Libraries imports

//* Libraries imports
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

//* Components imports
import Table, { Column } from "@/components/table/table";
import Loading from "@/components/loading/loading";

//* Hooks imports
import { ResponseCode, StatusFinanceiro, useFinanceiro, useIgrejas } from "@/hooks";

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
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-strong">Painel Financeiro</h2>
            <p className="text-xs md:text-sm text-muted">Visao de saldo, entradas, saidas e pendencias.</p>
          </div>
          <button className="px-3 py-2 rounded bg-surface-soft text-muted text-xs md:text-sm hover:bg-surface-hover" onClick={() => getAll()}>
            Atualizar painel
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border border-success-border bg-success-soft p-3">
            <p className="text-xs text-success">Entradas</p>
            <p className="text-xl font-semibold text-success">R$ {summary.entradas.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-danger-border bg-danger-soft p-3">
            <p className="text-xs text-danger">Saidas</p>
            <p className="text-xl font-semibold text-danger">R$ {summary.saidas.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-info-border bg-info-soft p-3">
            <p className="text-xs text-info">Saldo</p>
            <p className="text-xl font-semibold text-info">R$ {summary.saldo.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-warning-border bg-warning-soft p-3">
            <p className="text-xs text-warning">Pendentes</p>
            <p className="text-xl font-semibold text-warning">{summary.pendentes}</p>
          </div>
        </div>

        <div className="glass-soft rounded-lg p-3">
          <p className="text-sm font-semibold text-strong mb-2">Evolucao por mes</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 items-end min-h-32">
            {summary.chart.map((item) => (
              <div key={item.month} className="flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t ${item.value >= 0 ? "bg-success" : "bg-danger"}`}
                  style={{ height: `${Math.max((Math.abs(item.value) / maxChartValue) * 110, 10)}px` }}
                />
                <span className="text-[10px] text-muted">{item.month}</span>
              </div>
            ))}
            {summary.chart.length === 0 && <div className="text-xs text-subtle col-span-full">Sem dados para o grafico.</div>}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-xl p-3">
        <Table
          columns={columns}
          data={rows}
          columnsSearch={["acao", "status", "igrejaId"]}
          actions={[
            { name: "Editar", func: onEdit, type: "edit" },
            { name: "Excluir", func: onDelete, type: "delete" },
            { name: "Cadastrar", func: onCreate, type: "create" },
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
