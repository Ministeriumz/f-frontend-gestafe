"use client";
//* Libraries imports

//* Libraries imports
import { useState } from "react";

//* Utilities imports
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

type ResetPasswordPayload = {
  token: string;
  novaSenha: string;
  confirmacaoSenha: string;
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

  const forgotPassword = async (email: string): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      return await apiRequest<null>(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
        false
      );
    } finally {
      setLoading(false);
    }
  };

  const validateResetToken = async (token: string): Promise<ApiResponse<null>> => {
    return apiRequest<null>(
      "/auth/reset-password/validate",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      false
    );
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      return await apiRequest<null>(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        false
      );
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
    forgotPassword,
    validateResetToken,
    resetPassword,
    logout,
    isAuthenticated: isAuthenticated(),
  };
}

export default useAuth;

