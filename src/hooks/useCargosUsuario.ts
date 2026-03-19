"use client";

import { useState } from "react";
import { apiRequest, ApiResponse } from "@/lib/api";

export interface CargoUsuarioDTO {
  idUsuario: number;
  idCargo: number;
}

export function useCargosUsuario() {
  const [data, setData] = useState<CargoUsuarioDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (): Promise<ApiResponse<CargoUsuarioDTO[]>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<CargoUsuarioDTO[]>("/CargoUsuario");
      if (result.data) setData(result.data);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: CargoUsuarioDTO): Promise<ApiResponse<CargoUsuarioDTO>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<CargoUsuarioDTO>("/CargoUsuario", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (result.data) setData((prev) => [...prev, result.data as CargoUsuarioDTO]);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (idUsuario: number, idCargo: number): Promise<ApiResponse<null>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<null>(`/CargoUsuario/${idUsuario}/${idCargo}`, {
        method: "DELETE",
      });
      if (result.code === 1) {
        setData((prev) =>
          prev.filter((item) => !(item.idUsuario === idUsuario && item.idCargo === idCargo))
        );
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    setData,
    loading,
    error,
    getAll,
    create,
    remove,
  };
}

export default useCargosUsuario;

