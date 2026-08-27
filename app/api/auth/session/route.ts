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

async function revokeToken(token: string | undefined) {
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
    // Revoking an old session is best-effort and never blocks a new login.
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token =
    body && typeof body === "object" && "token" in body && typeof body.token === "string"
      ? body.token.trim()
      : "";

  if (!token) {
    return NextResponse.json(
      { message: "Google authentication token অনুপস্থিত।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let verifyResponse: Response;
  let payload: unknown = null;

  try {
    verifyResponse = await fetch(`${API_BASE}/api/v1/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      cache: "no-store",
    });

    const text = await verifyResponse.text();
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }
  } catch {
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভারের সাথে সংযোগ করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const user = verifyResponse.ok ? extractUser(payload) : null;

  if (!verifyResponse.ok || !user) {
    const response = NextResponse.json(
      {
        message:
          verifyResponse.status === 401
            ? "Google authentication token অবৈধ বা মেয়াদ শেষ হয়েছে।"
            : "Google authentication session যাচাই করা যায়নি।",
      },
      {
        status: verifyResponse.status === 401 ? 401 : 502,
        headers: NO_STORE_HEADERS,
      }
    );
    clearAuthCookie(response);
    return response;
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE)?.value;
  await revokeToken(previousToken);

  const response = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS }
  );

  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
