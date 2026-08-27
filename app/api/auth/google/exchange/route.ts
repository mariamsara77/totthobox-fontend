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

function errorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const message = (payload as Record<string, unknown>).message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "অবৈধ authentication request।" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const code =
    body && typeof body === "object" &&
    typeof (body as Record<string, unknown>).code === "string"
      ? (body as Record<string, unknown>).code.trim()
      : "";

  if (!code || code.length > 128) {
    return NextResponse.json(
      { message: "অবৈধ বা অনুপস্থিত Google authentication code।" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  let exchangeResponse: Response;

  try {
    exchangeResponse = await fetch(`${API_BASE}/api/auth/google/exchange`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication সার্ভারের সাথে সংযোগ করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const exchangePayload: unknown = await exchangeResponse
    .json()
    .catch(() => null);

  if (!exchangeResponse.ok) {
    const result = NextResponse.json(
      {
        message: errorMessage(
          exchangePayload,
          "Google authentication সম্পন্ন করা যায়নি।",
        ),
      },
      {
        status: exchangeResponse.status,
        headers: NO_STORE_HEADERS,
      },
    );
    clearAuthCookie(result);
    return result;
  }

  const payload =
    exchangePayload && typeof exchangePayload === "object"
      ? (exchangePayload as Record<string, unknown>)
      : null;

  const token =
    typeof payload?.token === "string"
      ? payload.token
      : typeof payload?.access_token === "string"
        ? payload.access_token
        : null;

  if (!token) {
    const result = NextResponse.json(
      { message: "Authentication সার্ভার token দেয়নি।" },
      { status: 502, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(result);
    return result;
  }

  let userResponse: Response;
  let userPayload: unknown = null;

  try {
    userResponse = await fetch(`${API_BASE}/api/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      cache: "no-store",
    });

    const text = await userResponse.text();
    try {
      userPayload = text ? JSON.parse(text) : null;
    } catch {
      userPayload = null;
    }
  } catch {
    const result = NextResponse.json(
      { message: "Authentication token যাচাই করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(result);
    return result;
  }

  if (userResponse.status === 401) {
    const result = NextResponse.json(
      { message: "Google authentication session অবৈধ।" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(result);
    return result;
  }

  if (!userResponse.ok) {
    const result = NextResponse.json(
      { message: "Google authentication session যাচাই করা যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(result);
    return result;
  }

  const user = extractUser(userPayload);

  if (!user) {
    const result = NextResponse.json(
      { message: "Google account information পাওয়া যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(result);
    return result;
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE)?.value;

  if (previousToken && previousToken !== token) {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${previousToken}`,
        },
        cache: "no-store",
      });
    } catch {
      // The new session remains valid if revoking the old session fails.
    }
  }

  const result = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS },
  );

  result.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);

  return result;
}
