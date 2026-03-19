"use client";

import { useCrud } from "./useCrud";

export interface LogDTO {
  id?: number;
  data: string;
  hora: string;
  acao: string;
  idUsuario?: number | null;
}

export function useLogs() {
  const crud = useCrud<LogDTO>({ endpoint: "Log" });
  return {
    ...crud,
  };
}

export default useLogs;

