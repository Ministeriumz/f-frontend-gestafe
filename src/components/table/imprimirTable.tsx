"use client";

import { FileText, Printer, Sheet, X } from "lucide-react";
import { useMemo, useState } from "react";

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type PrintColumn<T> = { key: keyof T; label: string };

type ImprimirTableProps<T extends Record<string, unknown>> = {
  columns: PrintColumn<T>[];
  data: T[];
  fileName?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function ImprimirTable<T extends Record<string, unknown>>({
  columns,
  data,
  fileName = "tabela",
}: ImprimirTableProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<keyof T>>(() => new Set(columns.map((column) => column.key)));

  const selectedColumns = useMemo(
    () => columns.filter((column) => selectedKeys.has(column.key)),
    [columns, selectedKeys],
  );

  const toggleKey = (key: keyof T) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const tableHtml = useMemo(() => {
    const head = selectedColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
    const body = data.map((row) => {
      const cells = selectedColumns.map((column) => `<td>${escapeHtml(String(row[column.key] ?? "-"))}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");
    return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }, [data, selectedColumns]);

  const exportExcel = () => {
    if (!selectedColumns.length) return;
    const blob = new Blob([
      `<html><head><meta charset="UTF-8" /></head><body>${tableHtml}</body></html>`,
    ], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!selectedColumns.length) return;
    const printWindow = window.open("", "_blank", "width=1024,height=768");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><meta charset="UTF-8" /><title>${escapeHtml(fileName)}</title>
      <style>
        body { color: #171717; font-family: Arial, sans-serif; padding: 28px; }
        h1 { font-size: 18px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border-bottom: 1px solid #e5e5e5; padding: 8px; text-align: left; font-size: 12px; }
        th { color: #525252; background: #fafafa; font-weight: 600; }
      </style></head><body><h1>${escapeHtml(fileName)}</h1>${tableHtml}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 200);
  };

  if (!data.length) return null;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Printer /> Exportar
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-[min(440px,82vw)] space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Exportar registros</h3>
            <p className="text-sm text-muted-foreground">Escolha as colunas e o formato do arquivo.</p>
          </div>

          <div className="max-h-52 overflow-auto rounded-lg border border-border p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {columns.map((column) => (
                <label key={String(column.key)} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <Checkbox checked={selectedKeys.has(column.key)} onCheckedChange={() => toggleKey(column.key)} />
                  {column.label}
                </label>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {data.length} registro(s) · {selectedColumns.length} coluna(s) selecionada(s)
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setIsOpen(false)}><X /> Fechar</Button>
            <Button variant="outline" onClick={exportExcel} disabled={!selectedColumns.length}><Sheet /> Excel</Button>
            <Button onClick={exportPdf} disabled={!selectedColumns.length}><FileText /> Imprimir PDF</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
