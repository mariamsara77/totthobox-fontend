import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  API_BASE,
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  NO_STORE_HEADERS,
  clearAuthCookie,
  extractUser,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-google-token", origin));
  }

  let laravelResponse: Response;
  let payload: unknown = null;

  try {
    laravelResponse = await fetch(`${API_BASE}/api/v1/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      cache: "no-store",
    });

    const text = await laravelResponse.text();
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=auth-backend-unavailable", origin));
  }

  if (laravelResponse.status === 401) {
    const response = NextResponse.redirect(new URL("/login?error=invalid-google-token", origin));
    clearAuthCookie(response);
    return response;
  }

  if (!laravelResponse.ok) {
    const response = NextResponse.redirect(new URL("/login?error=google-session-failed", origin));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const user = extractUser(payload);
  if (!user) {
    const response = NextResponse.redirect(new URL("/login?error=invalid-google-user", origin));
    clearAuthCookie(response);
    return response;
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE)?.value;

  if (previousToken && previousToken !== token) {
    try {
      await fetch(`${API_BASE}/api/v1/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${previousToken}`,
        },
        cache: "no-store",
      });
    } catch {
      // Stale-token revocation is best-effort and must not block login.
    }
  }

  const response = NextResponse.redirect(new URL("/", origin), {
    status: 303,
    headers: NO_STORE_HEADERS,
  });

  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
