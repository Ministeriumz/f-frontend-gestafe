"use client";

import React, { useMemo, useState } from "react";
import Modal from "../modal";
import Button from "../Button";

type PrintColumn<T> = {
  key: keyof T;
  label: string;
};

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
  const [selectedKeys, setSelectedKeys] = useState<Set<keyof T>>(() => new Set(columns.map((c) => c.key)));

  const selectedColumns = useMemo(
    () => columns.filter((column) => selectedKeys.has(column.key)),
    [columns, selectedKeys]
  );

  const toggleKey = (key: keyof T) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const tableHtml = useMemo(() => {
    const head = selectedColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
    const body = data
      .map((row) => {
        const cells = selectedColumns
          .map((column) => `<td>${escapeHtml(String(row[column.key] ?? "-"))}</td>`)
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    return `
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>${head}</tr>
        </thead>
        <tbody>
          ${body}
        </tbody>
      </table>
    `;
  }, [selectedColumns, data]);

  const exportExcel = () => {
    if (selectedColumns.length === 0) return;
    const html = `
      <html>
        <head><meta charset="UTF-8" /></head>
        <body>${tableHtml}</body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (selectedColumns.length === 0) return;
    const printWindow = window.open("", "_blank", "width=1024,height=768");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${escapeHtml(fileName)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d0d0d0; padding: 6px; text-align: left; font-size: 12px; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(fileName)}</h1>
          ${tableHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 200);
  };

  if(data.length === 0) return null;

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="!bg-primary">Imprimir / Exportar</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-700">Imprimir Tabela</h3>
            <p className="text-sm text-neutral-500">Escolha as colunas e formato de exportacao.</p>
          </div>

          <div className="max-h-52 overflow-auto rounded-lg border border-white/50 glass-soft p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {columns.map((column) => (
                <label key={String(column.key)} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={selectedKeys.has(column.key)}
                    onChange={() => toggleKey(column.key)}
                    className="accent-primary"
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </div>

          <div className="text-xs text-neutral-500">
            {data.length} registro(s) | {selectedColumns.length} coluna(s) selecionada(s)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button onClick={exportPdf}>PDF</Button>
            <Button onClick={exportExcel}>Excel</Button>
            <Button onClick={() => setIsOpen(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

