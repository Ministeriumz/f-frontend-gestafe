"use client";

import { useCallback } from "react";
import { useCrud } from "./useCrud";

export enum StatusFinanceiro {
  PAGO = 1,
  PENDENTE = 2,
}

export interface FinanceiroDTO {
  id?: number;
  valor: number;
  acao: string;
  data: string;
  status: StatusFinanceiro;
  igrejaId: number;
}

export function useFinanceiro() {
  const crud = useCrud<FinanceiroDTO>({ endpoint: "Financeiro" });

  const getByStatus = useCallback(
    async (status: StatusFinanceiro): Promise<FinanceiroDTO[]> => {
      const result = await crud.getAll();
      if (result.data && result.code === 1) {
        return result.data.filter((registro) => registro.status === status);
      }
      return [];
    },
    [crud]
  );

  return {
    ...crud,
    getByStatus,
    StatusFinanceiro,
  };
}

export default useFinanceiro;

