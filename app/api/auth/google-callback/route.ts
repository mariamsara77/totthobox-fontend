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
    return NextResponse.redirect(new URL("/login?error=missing-token", origin));
  }

  let laravelResponse: Response;
  let payload: unknown = null;

  try {
    laravelResponse = await fetch(`${API_BASE}/api/v1/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
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

  const user = laravelResponse.ok ? extractUser(payload) : null;
  if (!laravelResponse.ok || !user) {
    const response = NextResponse.redirect(new URL("/login?error=google-session-failed", origin));
    response.headers.set("Cache-Control", "no-store");
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
      // Session replacement is independent of stale-token revocation.
    }
  }

  const response = NextResponse.redirect(new URL("/", origin), {
    status: 303,
    headers: NO_STORE_HEADERS,
  });
  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
