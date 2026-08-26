import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

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
    // The browser cookie is still replaced below.
  }
}

export async function POST(request: Request) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/auth/register/verify`, {
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
      { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const result = NextResponse.json(stripAuthTokens(data), {
      status: response.status,
      headers: NO_STORE_HEADERS,
    });
    result.cookies.set("laravel_token", "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    });
    return result;
  }

  const token: string | undefined =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  const safeData = stripAuthTokens(data) as Record<string, unknown>;
  const result = NextResponse.json(
    { ...safeData, token_received: Boolean(token) },
    { status: response.status, headers: NO_STORE_HEADERS }
  );

  if (!token) {
    result.cookies.set("laravel_token", "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    });
    return result;
  }

  const previousToken = (await cookies()).get("laravel_token")?.value;
  if (previousToken && previousToken !== token) {
    await revokePreviousToken(previousToken);
  }

  result.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return result;
}
