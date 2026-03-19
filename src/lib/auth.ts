"use client";

const TOKEN_KEY = "token";
const USER_EMAIL_KEY = "userEmail";
const USER_ID_KEY = "userId";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, email?: string, userId?: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
  if (typeof userId === "number") localStorage.setItem(USER_ID_KEY, String(userId));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getSessionUser() {
  if (typeof window === "undefined") return { email: null, userId: null };
  return {
    email: localStorage.getItem(USER_EMAIL_KEY),
    userId: localStorage.getItem(USER_ID_KEY),
  };
}

