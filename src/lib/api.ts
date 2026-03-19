"use client";

import { getToken } from "./auth";

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

export enum ResponseCode {
  SUCCESS = 1,
  INVALID = 2,
  NOT_FOUND = 3,
  CONFLICT = 4,
  UNAUTHORIZED = 5,
  ERROR = 6,
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5290";

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

    const response = await fetch(`${BASE_URL}${path}`, {
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

    const result = (await response.json()) as ApiResponse<T>;
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return { code: ResponseCode.ERROR, message, data: null };
  }
}

