"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useThemeMode } from "@/components/theme/ThemeProvider";

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { resolvedTheme, setMode } = useThemeMode();
  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = isDark ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      type="button"
      onClick={() => setMode(nextTheme)}
      className={`group flex min-h-[42px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground/75 transition-all duration-200 hover:bg-foreground/8 hover:text-foreground ${className}`}
      aria-label={label}
      title={label}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground/8 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
        {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <strong className="text-xs font-semibold">{isDark ? "Tema claro" : "Tema escuro"}</strong>
        <small className="mt-0.5 text-[10px] font-normal text-foreground/45">
          {isDark ? "Iluminar a interface" : "Reduzir a luminosidade"}
        </small>
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full border border-foreground/10 transition-colors duration-300 ${isDark ? "bg-primary" : "bg-foreground/10"}`} aria-hidden="true">
        <span className={`absolute top-0.5 size-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? "translate-x-[17px]" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}
