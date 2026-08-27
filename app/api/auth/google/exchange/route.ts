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

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function getMessage(value: unknown, fallback: string): string {
  if (!isObject(value)) return fallback;
  return typeof value.message === "string" ? value.message : fallback;
}

function getToken(value: unknown): string | null {
  if (!isObject(value)) return null;

  const direct = value.token ?? value.access_token;
  if (typeof direct === "string" && direct.length > 0) return direct;

  const nested = value.data;
  if (!isObject(nested)) return null;

  const nestedToken = nested.token ?? nested.access_token;
  return typeof nestedToken === "string" && nestedToken.length > 0
    ? nestedToken
    : null;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "অবৈধ authentication request।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const code = isObject(body) && typeof body.code === "string"
    ? body.code.trim()
    : "";

  if (!code || code.length > 128) {
    return NextResponse.json(
      { message: "অবৈধ বা অনুপস্থিত Google authentication code।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let laravelRes: Response;

  try {
    laravelRes = await fetch(`${API_BASE}/api/auth/google/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "authentication সার্ভারের সাথে সংযোগ করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const data: unknown = await laravelRes.json().catch(() => null);

  if (!laravelRes.ok) {
    const response = NextResponse.json(
      {
        message: getMessage(
          data,
          "Google authentication code গ্রহণ করা যায়নি।"
        ),
      },
      {
        status: laravelRes.status,
        headers: NO_STORE_HEADERS,
      }
    );
    clearAuthCookie(response);
    return response;
  }

  const token = getToken(data);

  if (!token) {
    const response = NextResponse.json(
      { message: "authentication সার্ভার token দেয়নি।" },
      { status: 502, headers: NO_STORE_HEADERS }
    );
    clearAuthCookie(response);
    return response;
  }

  let verifyRes: Response;
  let verifyPayload: unknown = null;

  try {
    verifyRes = await fetch(`${API_BASE}/api/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      cache: "no-store",
    });

    const text = await verifyRes.text();
    try {
      verifyPayload = text ? JSON.parse(text) : null;
    } catch {
      verifyPayload = null;
    }
  } catch {
    const response = NextResponse.json(
      { message: "authentication token যাচাই করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
    clearAuthCookie(response);
    return response;
  }

  if (verifyRes.status === 401 || !verifyRes.ok) {
    const response = NextResponse.json(
      { message: "Google authentication session যাচাই করা যায়নি।" },
      {
        status: verifyRes.status === 401 ? 401 : 502,
        headers: NO_STORE_HEADERS,
      }
    );
    clearAuthCookie(response);
    return response;
  }

  const user = extractUser(verifyPayload);

  if (!user) {
    const response = NextResponse.json(
      { message: "Google account information পাওয়া যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS }
    );
    clearAuthCookie(response);
    return response;
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
      // Do not fail the new login because an old token could not be revoked.
    }
  }

  const response = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS }
  );

  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
