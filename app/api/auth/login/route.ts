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

interface JsonObject {
  [key: string]: unknown;
}

function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
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

async function revokePreviousToken(token: string | undefined) {
  if (!token) return;

  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    // A failed old-session revocation must not invalidate the new login.
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
    return failure("অবৈধ রিকোয়েস্ট বডি।", 400);
  }

  if (!asObject(body)) {
    return failure("অবৈধ রিকোয়েস্ট বডি।", 400);
  }

  let laravelResponse: Response;

  try {
    laravelResponse = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return failure("সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।", 503);
  }

  const payload = await readJson(laravelResponse);

  if (!laravelResponse.ok) {
    const response = NextResponse.json(
      stripAuthTokens(payload),
      { status: laravelResponse.status, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(response);
    return response;
  }

  const token = tokenFrom(payload);

  if (!token) {
    return failure("লগইন সার্ভার কোনো authentication token দেয়নি।", 502);
  }

  let verifyResponse: Response;

  try {
    verifyResponse = await fetch(`${API_BASE}/api/user`, {
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
    return failure("লগইন token যাচাই করা যায়নি।", 503);
  }

  const verifyPayload = await readJson(verifyResponse);
  const user = verifyResponse.ok ? extractUser(verifyPayload) : null;

  if (!verifyResponse.ok || !user) {
    return failure("লগইন সেশন যাচাই করা যায়নি।", verifyResponse.status === 401 ? 401 : 502);
  }

  const cookieStore = await cookies();
  await revokePreviousToken(cookieStore.get(AUTH_COOKIE)?.value);

  const response = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS },
  );

  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);

  return response;
}
