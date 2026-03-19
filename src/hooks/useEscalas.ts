"use client";

import { useCrud } from "./useCrud";

export interface EscalaDTO {
  id?: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  cargoId: number;
}

export function useEscalas() {
  const crud = useCrud<EscalaDTO>({
    endpoint: "Escala",
    putById: true,
  });

  return {
    ...crud,
  };
}

export default useEscalas;

