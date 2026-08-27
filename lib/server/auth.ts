import { cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export const AUTH_COOKIE_NAME = "laravel_token";

export const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Vary: "Cookie, Authorization",
};

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/api${normalized}`;
}

export async function getAuthToken() {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}

export async function verifyToken(token: string) {
  return fetch(apiUrl("/v1/me"), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
    cache: "no-store",
  });
}

export async function revokeToken(token?: string) {
  if (!token) return;

  try {
    await fetch(apiUrl("/v1/logout"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    // Local session replacement/logout remains authoritative.
  }
}
