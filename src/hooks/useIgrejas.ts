"use client";

import { useCallback } from "react";
import { ApiResponse, useCrud } from "./useCrud";

export interface IgrejaDTO {
  id?: number;
  nome: string;
  cnpj: string;
  estado: string;
  rua: string;
  cep: string;
  numero: string;
}

export function useIgrejas() {
  const crud = useCrud<IgrejaDTO>({ endpoint: "Igreja" });

  const atualizarParcial = useCallback(
    async (id: number, dados: Partial<IgrejaDTO>): Promise<ApiResponse<IgrejaDTO>> => {
      return crud.patch(id, dados);
    },
    [crud]
  );

  return {
    ...crud,
    atualizarParcial,
  };
}

export default useIgrejas;

