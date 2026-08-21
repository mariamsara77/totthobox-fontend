// lib/auth.ts

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// API কলের জন্য ready-made headers
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


// lib/auth.ts
import apiFetch from "./api";

export async function login(email: string, password: string): Promise<string> {
  const data = await apiFetch<{ token: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.token; // localStorage বা httpOnly cookie-তে রাখো
}