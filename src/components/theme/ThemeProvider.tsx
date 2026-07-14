"use client";
//* Libraries imports

//* Libraries imports
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = "gestafe-theme-mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode): ResolvedTheme {
  const root = document.documentElement;
  const systemTheme = getSystemTheme();
  const resolved = mode === "system" ? systemTheme : mode;

  root.setAttribute("data-theme", resolved);

  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const savedMode = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? "system";
    setModeState(savedMode);
    setResolvedTheme(applyTheme(savedMode));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      setResolvedTheme((current) => {
        if (mode !== "system") return current;
        return applyTheme("system");
      });
    };

    media.addEventListener("change", handleSystemThemeChange);

    return () => {
      media.removeEventListener("change", handleSystemThemeChange);
    };
  }, [mode]);

  const setMode = (nextMode: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, nextMode);
    setModeState(nextMode);
    setResolvedTheme(applyTheme(nextMode));
  };

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider");
  }

  return context;
}
