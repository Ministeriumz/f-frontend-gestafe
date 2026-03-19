"use client";

import { useCrud } from "./useCrud";

export interface ConfiguracoesDTO {
  igrejaId: number;
  configuracaoJson: string;
}

export function useConfiguracoes() {
  const crud = useCrud<ConfiguracoesDTO>({
    endpoint: "Configuracoes",
    idField: "igrejaId",
    putById: true,
  });

  return {
    ...crud,
  };
}

export default useConfiguracoes;

