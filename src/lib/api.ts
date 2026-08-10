"use client";
//* Utilities imports

//* Utilities imports
import { getToken } from "./auth";

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

export enum ResponseCode {
  SUCCESS = 200,
  INVALID = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNAUTHORIZED = 401,
  ERROR = 500,
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5290";

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  authenticated = true
): Promise<ApiResponse<T>> {
  try {
    const headers = new Headers(init?.headers || {});
    const hasBody = Boolean(init?.body);
    const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;

    if (hasBody && !isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (authenticated) {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!isJson) {
      if (!response.ok) {
        return { code: ResponseCode.ERROR, message: `Erro HTTP ${response.status}`, data: null };
      }
      return { code: ResponseCode.SUCCESS, message: "Operação realizada com sucesso", data: null };
    }

    const result = (await response.json()) as Partial<ApiResponse<T>> & {
      title?: string;
      errors?: Record<string, string[]>;
      status?: string;
    };

    if (typeof result.code === "number") {
      return {
        code: result.code,
        message: result.message || (response.ok ? "Operação realizada com sucesso" : `Erro HTTP ${response.status}`),
        data: result.data ?? null,
      };
    }

    const validationMessage = result.errors
      ? Object.values(result.errors).flat().join(" ")
      : undefined;
    return {
      code: response.status === 400 ? ResponseCode.INVALID
        : response.status === 401 ? ResponseCode.UNAUTHORIZED
          : response.status === 404 ? ResponseCode.NOT_FOUND
            : response.status === 409 ? ResponseCode.CONFLICT
              : response.ok ? ResponseCode.SUCCESS : ResponseCode.ERROR,
      message: result.message || result.status || validationMessage || result.title || `Erro HTTP ${response.status}`,
      data: result.data ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return { code: ResponseCode.ERROR, message, data: null };
  }
}

