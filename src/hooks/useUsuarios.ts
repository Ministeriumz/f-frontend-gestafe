"use client";

import { useCallback } from "react";
import { ApiResponse, useCrud } from "./useCrud";

export interface UsuarioDTO {
  id?: number;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  senha?: string;
  idIgreja: number;
  idTipoUsuario: number;
}

export function useUsuarios() {
  const crud = useCrud<UsuarioDTO>({ endpoint: "Usuario" });

  const atualizarParcial = useCallback(
    async (id: number, dados: Partial<UsuarioDTO>): Promise<ApiResponse<UsuarioDTO>> => {
      return crud.patch(id, dados);
    },
    [crud]
  );

  return {
    ...crud,
    atualizarParcial,
  };
}

export default useUsuarios;

