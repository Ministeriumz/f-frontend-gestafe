"use client";
//* Libraries imports

//* Libraries imports
import { useCallback } from "react";

//* Utilities imports
import { ApiResponse, useCrud } from "./useCrud";

export interface TipoUsuarioDTO {
  id?: number;
  nome: string;
}

export function useTiposUsuario() {
  const crud = useCrud<TipoUsuarioDTO>({ endpoint: "TipoUsuario" });

  const atualizarParcial = useCallback(
    async (id: number, dados: Partial<TipoUsuarioDTO>): Promise<ApiResponse<TipoUsuarioDTO>> => {
      return crud.patch(id, dados);
    },
    [crud]
  );

  return {
    ...crud,
    atualizarParcial,
  };
}

export default useTiposUsuario;

