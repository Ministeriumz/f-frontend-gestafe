"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Camp = {
  key: string;
  type?: string;
  placeholder: string;
  options?: { label: string; value: string | number }[];
  required?: boolean | ((mode: string) => boolean);
  validate?: (value: unknown, formData: Record<string, unknown>) => string | undefined;
};

type FormProps = {
  camps?: Camp[];
  object?: Record<string, unknown>;
  type?: string;
  onCancel?: () => void;
  onConfirm?: (data: Record<string, unknown>) => void | Promise<void>;
  onEdit?: (data: Record<string, unknown>) => void | Promise<void>;
  onDelete?: (data: Record<string, unknown>) => void | Promise<void>;
};

export default function Form({ camps, object, type = "create", onCancel, onConfirm, onEdit, onDelete }: FormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(object || {});
  const [isLoading, setIsLoading] = useState(false);
  const [optionFilters, setOptionFilters] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => { setFormData(object || {}); setTouched({}); setOptionFilters({}); }, [object, type]);

  const normalizedFields = useMemo<Camp[]>(() => camps?.length ? camps : Object.keys(object || {}).map((key) => ({ key, placeholder: key })), [camps, object]);
  const visibleFields = normalizedFields.filter((field) => !["id", "idsecretaria", "idfornecedor", "idorcamento"].includes(field.key.toLowerCase()));
  const columns = visibleFields.length <= 4 ? "grid-cols-1" : visibleFields.length <= 8 ? "grid-cols-2" : "grid-cols-3";
  const labels: Record<string, string> = { create: "Cadastrar", edit: "Editar", delete: "Excluir" };
  const isRequired = (field: Camp) => typeof field.required === "function" ? field.required(type) : field.required ?? true;

  const errors = useMemo(() => Object.fromEntries(visibleFields.map((field) => {
    const value = formData[field.key];
    const empty = value === undefined || value === null || String(value).trim() === "";
    const error = isRequired(field) && empty ? `${field.placeholder} é obrigatório.` : field.validate?.(value, formData);
    return [field.key, error];
  })), [formData, visibleFields]);

  const change = (key: string, value: string) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
    setTouched((previous) => ({ ...previous, [key]: true }));
  };
  const toggleOption = (key: string, value: string) => {
    setFormData((previous) => {
      const current = Array.isArray(previous[key]) ? previous[key].map(String) : [];
      return { ...previous, [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] };
    });
    setTouched((previous) => ({ ...previous, [key]: true }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(Object.fromEntries(visibleFields.map((field) => [field.key, true])));
    if (Object.values(errors).some(Boolean)) return;
    setIsLoading(true);
    try {
      if (type === "edit" && onEdit) await onEdit(formData);
      else if (type === "delete" && onDelete) await onDelete(formData);
      else if (onConfirm) await onConfirm(formData);
    } finally { setIsLoading(false); }
  };

  return <form className="flex min-w-[min(620px,80vw)] flex-col" onSubmit={submit} noValidate>
    <div><h1 className="text-2xl font-semibold">{labels[type] || "Cadastrar"}</h1><p className="text-subtle">Preencha os dados abaixo. Os campos obrigatórios são validados imediatamente.</p></div>
    <div className={`mt-4 grid ${columns} gap-3`}>
      {visibleFields.map((field) => {
        const error = touched[field.key] ? errors[field.key] as string | undefined : undefined;
        const disabled = type === "view" || type === "delete";
        return <label key={field.key} className="flex flex-col gap-1"><span className="text-xs font-medium text-muted-foreground">{field.placeholder}{isRequired(field) ? " *" : ""}</span>
          {field.type === "multi-select" ? <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-border bg-muted/20 p-2">
            {(field.options || []).map((option) => {
              const selectedValues = Array.isArray(formData[field.key]) ? formData[field.key] as unknown[] : [];
              const selected = selectedValues.map((value) => String(value)).includes(String(option.value));
              return <button key={`${field.key}-${option.value}`} type="button" disabled={disabled} onClick={() => toggleOption(field.key, String(option.value))} className={`rounded-md border px-2 py-1.5 text-left text-xs transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}>{selected ? "✓ " : ""}{option.label}</button>;
            })}
          </div> : field.type === "search-select" ? <>
            <Input placeholder={`Buscar ${field.placeholder}`} disabled={disabled} value={optionFilters[field.key] || ""} onChange={(e) => setOptionFilters((previous) => ({ ...previous, [field.key]: e.target.value }))} />
            <select className="glass-input max-h-[48px] w-full rounded-lg p-3 text-strong" disabled={disabled} value={String(formData[field.key] ?? "")} onChange={(e) => change(field.key, e.target.value)}>
              <option value="">Selecione {field.placeholder}</option>
              {(field.options || []).filter((option) => option.label.toLowerCase().includes((optionFilters[field.key] || "").toLowerCase().trim())).map((option) => <option key={`${field.key}-${option.value}`} value={String(option.value)}>{option.label}</option>)}
            </select>
          </> : <Input placeholder={field.placeholder} type={field.type || "text"} disabled={disabled} value={String(formData[field.key] ?? "")} onChange={(e) => change(field.key, e.target.value)} />}
          {error && <small className="text-xs text-destructive">{error}</small>}
        </label>;
      })}
    </div>
    <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2"><Button type="button" variant="outline" className="!w-full" onClick={onCancel}>Cancelar</Button>{type !== "view" && <Button type="submit" className="!w-full" disabled={isLoading}>{isLoading ? "Processando..." : "Confirmar"}</Button>}</div>
  </form>;
}
