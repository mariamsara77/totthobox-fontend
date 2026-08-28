import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";
import {
  API_BASE,
  AUTH_COOKIE,
  AUTH_COOKIE_OPTIONS,
  NO_STORE_HEADERS,
  clearAuthCookie,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function tokenFrom(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const data =
    source.data && typeof source.data === "object"
      ? (source.data as Record<string, unknown>)
      : null;

  const token = source.token ?? source.access_token ?? data?.token ?? data?.access_token;
  return typeof token === "string" && token.trim() ? token.trim() : null;
}

export async function POST(request: Request) {
  let upstream: Response;

  try {
    upstream = await fetch(`${API_BASE}/api/auth/register/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: await request.text(),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।" },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const payload = await upstream.json().catch(() => null);
  const token = tokenFrom(payload);

  if (!upstream.ok || !token) {
    const response = NextResponse.json(
      stripAuthTokens(payload),
      {
        status: upstream.ok ? 502 : upstream.status,
        headers: NO_STORE_HEADERS,
      },
    );
    clearAuthCookie(response);
    return response;
  }

  const previousToken = (await cookies()).get(AUTH_COOKIE)?.value;
  if (previousToken && previousToken !== token) {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${previousToken}`,
      },
      cache: "no-store",
    }).catch(() => undefined);
  }

  const response = NextResponse.json(
    stripAuthTokens(payload),
    { status: upstream.status, headers: NO_STORE_HEADERS },
  );
  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
