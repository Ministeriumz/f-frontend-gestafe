"use client";

import { useCallback, useState } from "react";
import { apiRequest, ApiResponse, ResponseCode } from "@/lib/api";

type CrudOptions<T> = {
  endpoint: string;
  idField?: keyof T & string;
  putById?: boolean;
};

export function useCrud<T extends Record<string, any>>({
  endpoint,
  idField = "id" as keyof T & string,
  putById = false,
}: CrudOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getId = useCallback(
    (item: T): number => {
      const raw = item?.[idField];
      return Number(raw);
    },
    [idField]
  );

  const getAll = useCallback(async (): Promise<ApiResponse<T[]>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<T[]>(`/${endpoint}`);
      if (result.code === ResponseCode.SUCCESS && result.data) {
        setData(result.data);
      } else if (result.code === ResponseCode.ERROR || result.code === ResponseCode.UNAUTHORIZED) {
        setError(result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const getById = useCallback(
    async (id: number | string): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        return await apiRequest<T>(`/${endpoint}/${id}`);
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const create = useCallback(
    async (item: Partial<T>): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest<T>(`/${endpoint}`, {
          method: "POST",
          body: JSON.stringify(item),
        });

        if (result.code === ResponseCode.SUCCESS && result.data) {
          setData((prev) => [...prev, result.data as T]);
        } else if (result.code === ResponseCode.ERROR || result.code === ResponseCode.UNAUTHORIZED) {
          setError(result.message);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const update = useCallback(
    async (item: T): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const id = getId(item);
        const path = putById ? `/${endpoint}/${id}` : `/${endpoint}`;

        const result = await apiRequest<T>(path, {
          method: "PUT",
          body: JSON.stringify(item),
        });

        if (result.code === ResponseCode.SUCCESS) {
          setData((prev) =>
            prev.map((current) => (getId(current) === id ? ({ ...current, ...item } as T) : current))
          );
        } else if (result.code === ResponseCode.ERROR || result.code === ResponseCode.UNAUTHORIZED) {
          setError(result.message);
        }

        return result;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, getId, putById]
  );

  const patch = useCallback(
    async (id: number, partialItem: Partial<T>): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest<T>(`/${endpoint}/${id}`, {
          method: "PATCH",
          body: JSON.stringify(partialItem),
        });

        if (result.code === ResponseCode.SUCCESS && result.data) {
          setData((prev) =>
            prev.map((item) => (getId(item) === id ? ({ ...item, ...result.data } as T) : item))
          );
        } else if (result.code === ResponseCode.ERROR || result.code === ResponseCode.UNAUTHORIZED) {
          setError(result.message);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, getId]
  );

  const remove = useCallback(
    async (id: number | string): Promise<ApiResponse<null>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest<null>(`/${endpoint}/${id}`, {
          method: "DELETE",
        });

        if (result.code === ResponseCode.SUCCESS) {
          setData((prev) => prev.filter((item) => String(getId(item)) !== String(id)));
        } else if (result.code === ResponseCode.ERROR || result.code === ResponseCode.UNAUTHORIZED) {
          setError(result.message);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, getId]
  );

  return {
    data,
    setData,
    loading,
    error,
    setError,
    getAll,
    getById,
    create,
    update,
    patch,
    remove,
  };
}

export type { ApiResponse };
export { ResponseCode };
export default useCrud;
