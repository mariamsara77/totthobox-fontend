import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";
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

async function revokePreviousToken(token: string | undefined) {
  if (!token) return;

  try {
    await fetch(`${API_BASE}/api/v1/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    // Replacing the credential is independent of stale-token revocation.
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "অবৈধ রিকোয়েস্ট বডি।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const data = await laravelRes.json().catch(() => ({}));

  if (!laravelRes.ok) {
    const response = NextResponse.json(stripAuthTokens(data), {
      status: laravelRes.status,
      headers: NO_STORE_HEADERS,
    });
    clearAuthCookie(response);
    return response;
  }

  const token: string | undefined =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  if (!token) {
    const response = NextResponse.json(
      { message: "লগইন সার্ভার কোনো authentication token দেয়নি।" },
      { status: 502, headers: NO_STORE_HEADERS }
    );
    clearAuthCookie(response);
    return response;
  }

  // Never trust a token merely because /login returned 200. Verify it against
  // the canonical Laravel /me endpoint before exposing a session to the app.
  let verifyResponse: Response;
  let verifyPayload: unknown = null;
  try {
    verifyResponse = await fetch(`${API_BASE}/api/v1/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const text = await verifyResponse.text();
    try {
      verifyPayload = text ? JSON.parse(text) : null;
    } catch {
      verifyPayload = null;
    }
  } catch {
    const response = NextResponse.json(
      { message: "লগইন token যাচাই করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
    clearAuthCookie(response);
    return response;
  }

  const user = verifyResponse.ok ? extractUser(verifyPayload) : null;
  if (!verifyResponse.ok || !user) {
    const response = NextResponse.json(
      { message: "লগইন সেশন যাচাই করা যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS }
    );
    clearAuthCookie(response);
    return response;
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE)?.value;
  await revokePreviousToken(previousToken);

  const response = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS }
  );
  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
