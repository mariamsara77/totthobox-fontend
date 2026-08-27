import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export const AUTH_COOKIE = "laravel_token";

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

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  slug?: string;
  avatar_url?: string | null;
  [key: string]: unknown;
}

export function extractUser(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== "object") return null;

  const source = payload as Record<string, unknown>;
  const candidate = source.user ?? source.data ?? payload;
  if (!candidate || typeof candidate !== "object") return null;

  const user = candidate as Record<string, unknown>;
  if (
    (typeof user.id !== "number" && typeof user.id !== "string") ||
    typeof user.email !== "string" ||
    typeof user.name !== "string"
  ) {
    return null;
  }

  return {
    ...user,
    id: Number(user.id),
    name: user.name,
    email: user.email,
  } as AuthUser;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function verifyLaravelToken(token: string) {
  const response = await fetch(`${API_BASE}/api/v1/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let payload: unknown = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  return {
    response,
    payload,
    user: response.ok ? extractUser(payload) : null,
  };
}
