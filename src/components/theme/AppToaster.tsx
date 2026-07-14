"use client";

import React from "react";
import { Toaster } from "sonner";

import { useThemeMode } from "@/components/theme/ThemeProvider";

export default function AppToaster() {
  const { resolvedTheme } = useThemeMode();

  return <Toaster position="top-right" theme={resolvedTheme} />;
}
