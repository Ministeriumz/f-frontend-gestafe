"use client";

import { useState } from "react";
import { apiRequest, ApiResponse } from "@/lib/api";
import { clearSession, isAuthenticated, setSession } from "@/lib/auth";

type LoginPayload = {
  email: string;
  senha: string;
};

type LoginResponseDTO = {
  token: string;
  expiraEm: string;
  usuarioId: number;
  email: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginPayload): Promise<ApiResponse<LoginResponseDTO>> => {
    setLoading(true);
    try {
      const result = await apiRequest<LoginResponseDTO>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        false
      );

      if (result.data?.token) {
        setSession(result.data.token, result.data.email, result.data.usuarioId);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  return {
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  };
}

export default useAuth;

