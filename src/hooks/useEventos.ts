"use client";

import { useCrud } from "./useCrud";

export interface EventoDTO {
  id?: number;
  nome: string;
  tipo: string;
  resumo: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
}

export function useEventos() {
  const crud = useCrud<EventoDTO>({ endpoint: "Eventos" });

  return {
    ...crud,
  };
}

export default useEventos;

