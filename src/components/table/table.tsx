"use client";

import { Columns3, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import ConfirmDialog from "@/components/dialog";
import Form, { Camp } from "@/components/form/form";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ImprimirTable from "./imprimirTable";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type Action = {
  name: string;
  func: (row: any) => void;
  type?: "create" | "edit" | "delete";
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  columnsSearch: string[];
  actions?: Action[];
  onCreate?: (data: T) => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  tipo?: "create" | "edit" | "delete";
  setTipo?: React.Dispatch<React.SetStateAction<"create" | "edit" | "delete">>;
  formFields?: Camp[];
};

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  columnsSearch,
  actions,
  onCreate,
  onEdit,
  onDelete,
  tipo = "create",
  setTipo,
  formFields,
}: TableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<T | null>(null);
  const [currentType, setCurrentType] = useState<"create" | "edit" | "delete">(tipo);
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    () => new Set(columns.map((column) => column.key)),
  );

  useEffect(() => setCurrentType(tipo), [tipo]);

  const visibleCols = useMemo(
    () => columns.filter((column) => visibleColumns.has(column.key)),
    [columns, visibleColumns],
  );

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([columnKey, filterValue]) => {
        if (!filterValue.trim()) return true;
        const cellValue = row[columnKey];
        const stringValue = cellValue == null ? "" : String(cellValue).toLowerCase();
        const searchTerm = filterValue.toLowerCase().trim();

        if (searchTerm.includes(",")) {
          const terms = searchTerm.split(",").map((term) => term.trim()).filter(Boolean);
          return terms.some((term) => stringValue.includes(term));
        }

        if (searchTerm.includes("-") && !Number.isNaN(Number(cellValue))) {
          const [min, max] = searchTerm.split("-").map(Number);
          const numericValue = Number(cellValue);
          if (!Number.isNaN(min) && !Number.isNaN(max)) return numericValue >= min && numericValue <= max;
        }

        const operatorMatch = searchTerm.match(/^([><=]+)\s*(.+)$/);
        if (operatorMatch && !Number.isNaN(Number(cellValue))) {
          const [, operator, value] = operatorMatch;
          const numericValue = Number(cellValue);
          const compareValue = Number(value);
          if (!Number.isNaN(compareValue)) {
            if (operator === ">") return numericValue > compareValue;
            if (operator === "<") return numericValue < compareValue;
            if (operator === ">=") return numericValue >= compareValue;
            if (operator === "<=") return numericValue <= compareValue;
            if (operator === "=") return numericValue === compareValue;
          }
        }

        return stringValue.includes(searchTerm);
      });
    });
  }, [data, filters]);

  const toggleColumn = (key: keyof T) => {
    setVisibleColumns((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleRow = (index: number, checked: boolean) => {
    setSelectedRows((current) => {
      const next = new Set(current);
      if (checked) next.add(index);
      else next.delete(index);
      return next;
    });
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters((current) => ({ ...current, [columnKey]: value }));
    setSelectedRows(new Set());
  };

  const actionFunc = (action: Action, row: T) => {
    const selectedType = action.type || "edit";
    setCurrentRow(row);
    if (selectedType === "delete") {
      setIsConfirmOpen(true);
      return;
    }
    setCurrentType(selectedType);
    setTipo?.(selectedType);
    setIsModalOpen(true);
  };

  const generatedFields: Camp[] = columns.map((column) => ({
    key: String(column.key),
    placeholder: column.label,
  }));
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-xs">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {columnsSearch.map((columnKey) => (
            <div key={columnKey} className="relative min-w-[160px] flex-1 sm:max-w-[240px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters[columnKey] ?? ""}
                placeholder={`Buscar por ${columnKey}`}
                className="pl-8 capitalize"
                onChange={(event) => handleFilterChange(columnKey, event.target.value)}
              />
            </div>
          ))}

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
              <X /> Limpar
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <ImprimirTable columns={columns} data={filteredData} fileName="relatorio_tabela" />
            {onCreate && (
              <Button
                size="sm"
                onClick={() => {
                  setCurrentType("create");
                  setCurrentRow(null);
                  setIsModalOpen(true);
                  setTipo?.("create");
                }}
              >
                <Plus /> Cadastrar
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="w-10 px-4 py-2.5" />
                {visibleCols.map((column) => {
                  if ((column.label).toLocaleLowerCase().includes("id")) {
                    return;
                  }
                  return (
                    <th key={String(column.key)} className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium">
                      {column.label}
                    </th>
                  )
                })}
                <th className="px-4 py-2.5 text-right text-xs font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={visibleCols.length + 2} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Nenhum dado encontrado
                  </td>
                </tr>
              ) : filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.has(rowIndex)}
                      onCheckedChange={(checked) => toggleRow(rowIndex, checked === true)}
                      aria-label={`Selecionar linha ${rowIndex + 1}`}
                    />
                  </td>
                  {visibleCols.map((column) => {

                    if ((column.label).toLocaleLowerCase().includes("id")) {
                      return;
                    }
                    return (
                      <td key={String(column.key)} className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "-")}
                      </td>
                    )
                  })}
                  <td className="flex justify-end gap-1 px-4 py-2">
                    {actions?.map((action, actionIndex) => {
                      if (action.type === "create") return null;
                      return (
                        <Button
                          key={`${action.name}-${actionIndex}`}
                          variant={action.type === "delete" ? "destructive" : "ghost"}
                          size="sm"
                          onClick={() => actionFunc(action, row)}
                        >
                          {action.type === "delete" ? <Trash2 /> : <Pencil />}
                          {action.name}
                        </Button>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {filteredData.length} de {data.length} {data.length === 1 ? "registro" : "registros"}
          </span>
          {selectedRows.size > 0 && (
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-on-primary">
              {selectedRows.size} selecionada(s)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Columns3 className="size-4" /> Colunas
          </span>
          {columns.map((column) => (
            <label key={String(column.key)} className="flex cursor-pointer select-none items-center gap-2 text-xs text-muted-foreground">
              <Checkbox checked={visibleColumns.has(column.key)} onCheckedChange={() => toggleColumn(column.key)} />
              {column.label}
            </label>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          type={currentType}
          object={currentRow as T}
          camps={formFields || generatedFields}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={(formData) => onCreate?.(formData as T)}
          onEdit={(formData) => onEdit?.(formData as T)}
          onDelete={(formData) => onDelete?.(formData as T)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Excluir este registro?"
        description="Esta ação é permanente e o registro não poderá ser recuperado depois da exclusão."
        confirmLabel="Excluir registro"
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (currentRow) await onDelete?.(currentRow);
        }}
      />
    </>
  );
}
