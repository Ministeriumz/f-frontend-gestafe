"use client";

import { useCrud } from "./useCrud";

export interface CargoDTO {
  idCargo?: number;
  nome: string;
}

export function useCargos() {
  const crud = useCrud<CargoDTO>({
    endpoint: "Cargo",
    idField: "idCargo",
    putById: true,
  });

  return {
    ...crud,
  };
}

export default useCargos;

