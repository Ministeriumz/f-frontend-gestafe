"use client";

import React from "react";

import { useThemeMode } from "@/components/theme/ThemeProvider";

type ThemeOption = { value: "light" | "dark" | "system"; label: string };

const options: ThemeOption[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { mode, setMode } = useThemeMode();

  return (
    <label className={`flex items-center gap-2 text-xs text-foreground/70 ${className}`}>
      <span>Tema</span>
      <select
        value={mode}
        onChange={(event) => setMode(event.target.value as "light" | "dark" | "system")}
        className="glass-soft rounded-md px-2.5 py-1.5 text-xs text-foreground outline-none"
        aria-label="Selecionar tema"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
