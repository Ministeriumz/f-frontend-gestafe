"use client";

import { useCrud } from "./useCrud";

export interface MinisterioDTO {
  id?: number;
  nome: string;
  tamanho_max: number;
}

export function useMinisterios() {
  const crud = useCrud<MinisterioDTO>({ endpoint: "Ministerio" });
  return { ...crud };
}

export default useMinisterios;

