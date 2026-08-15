"use client";

import { useCallback, useState } from "react";
import { apiRequest, type ApiResponse } from "@/lib/api";

export interface EscalaDTO {
  id?: number;
  igrejaId: number;
  dataSalvamento: string;
  horaSalvamento: string;
  escalaJson: string;
}

export interface GerarEscalaPayload {
  dataInicio: string;
  dataFim: string;
  diasDaSemana: number[];
}

export interface AlocacaoAutomatica {
  cargo: string;
  usuario: string;
}

export interface DiaEscalaAutomatica {
  data: string;
  diaDaSemana: string;
  alocacoes: AlocacaoAutomatica[];
}

export function useEscalas() {
  const [loading, setLoading] = useState(false);

  const gerarAutomatica = useCallback(async (payload: GerarEscalaPayload): Promise<ApiResponse<DiaEscalaAutomatica[]>> => {
    const params = new URLSearchParams({ DataInicio: payload.dataInicio, DataFim: payload.dataFim });
    payload.diasDaSemana.forEach((dia) => params.append("DiasDaSemana", String(dia)));
    setLoading(true);
    try {
      return await apiRequest<DiaEscalaAutomatica[]>(`/Escala/gerar?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, gerarAutomatica };
}

export default useEscalas;
