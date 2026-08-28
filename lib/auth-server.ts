import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Server-only Laravel API origin. */
export const API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://admin.totthobox.com";

/** The only authentication cookie used by the frontend. */
export const AUTH_COOKIE = "__Host-totthobox_session";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Vary: "Cookie, Authorization",
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

  const id = Number(user.id);
  if (!Number.isSafeInteger(id) || id <= 0) return null;

  return { ...user, id, name: user.name, email: user.email } as AuthUser;
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  // Remove the previous frontend cookie during the migration from auth-v7.
  response.cookies.set("laravel_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function verifyLaravelToken(token: string) {
  const response = await fetch(`${API_BASE}/api/user`, {
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
    // Keep payload null for non-JSON upstream responses.
  }

  return {
    response,
    payload,
    user: response.ok ? extractUser(payload) : null,
  };
}
