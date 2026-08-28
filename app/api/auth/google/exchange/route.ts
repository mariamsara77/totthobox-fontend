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

interface JsonObject {
  [key: string]: unknown;
}

function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function messageFrom(value: unknown, fallback: string): string {
  const object = asObject(value);
  const message = object?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

function tokenFrom(value: unknown): string | null {
  const object = asObject(value);
  const direct = object?.token;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const accessToken = object?.access_token;
  if (typeof accessToken === "string" && accessToken.trim()) {
    return accessToken.trim();
  }

  const data = asObject(object?.data);
  const nestedToken = data?.token;
  if (typeof nestedToken === "string" && nestedToken.trim()) {
    return nestedToken.trim();
  }

  const nestedAccessToken = data?.access_token;
  if (typeof nestedAccessToken === "string" && nestedAccessToken.trim()) {
    return nestedAccessToken.trim();
  }

  return null;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function failure(message: string, status: number) {
  const response = NextResponse.json(
    { success: false, message },
    { status, headers: NO_STORE_HEADERS },
  );
  clearAuthCookie(response);
  return response;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return failure("অবৈধ authentication request।", 400);
  }

  const bodyObject = asObject(body);
  const rawCode = bodyObject?.code;
  const code = typeof rawCode === "string" ? rawCode.trim() : "";

  if (!code || code.length > 128) {
    return failure("অবৈধ বা অনুপস্থিত Google authentication code।", 400);
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
    return failure("Authentication সার্ভারের সাথে সংযোগ করা যায়নি।", 503);
  }

  const exchangePayload = await readJson(exchangeResponse);

  if (!exchangeResponse.ok) {
    return failure(
      messageFrom(exchangePayload, "Google authentication সম্পন্ন করা যায়নি।"),
      exchangeResponse.status,
    );
  }

  const token = tokenFrom(exchangePayload);

  if (!token) {
    return failure("Authentication সার্ভার token দেয়নি।", 502);
  }

  let userResponse: Response;

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
  } catch {
    return failure("Authentication token যাচাই করা যায়নি।", 503);
  }

  const userPayload = await readJson(userResponse);

  if (userResponse.status === 401) {
    return failure("Google authentication session অবৈধ।", 401);
  }

  if (!userResponse.ok) {
    return failure("Google authentication session যাচাই করা যায়নি।", 502);
  }

  const user = extractUser(userPayload);

  if (!user) {
    return failure("Google account information পাওয়া যায়নি।", 502);
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
      // Keep the newly authenticated session even if old-token revocation fails.
    }
  }

  const response = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS },
  );

  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);

  return response;
}
