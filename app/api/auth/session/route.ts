import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
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
    await fetch(`${API_BASE}/api/v1/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    // The new credential replaces the browser credential regardless.
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json(
      { message: "Google authentication token অনুপস্থিত।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let verifyResponse: Response;
  try {
    verifyResponse = await fetch(`${API_BASE}/api/v1/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভারের সাথে সংযোগ করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const user = await verifyResponse.json().catch(() => null);

  if (!verifyResponse.ok || !user || typeof user !== "object" || !("id" in user)) {
    return NextResponse.json(
      { message: "Google authentication token অবৈধ বা মেয়াদ শেষ হয়েছে।" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get("laravel_token")?.value;
  await revokePreviousToken(previousToken);

  const response = NextResponse.json(
    { success: true },
    { status: 200, headers: NO_STORE_HEADERS }
  );
  response.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return response;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", origin));
  }

  const response = await POST(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
  );

  if (!response.ok) {
    return NextResponse.redirect(new URL("/login?error=google-session-failed", origin));
  }

  const redirect = NextResponse.redirect(new URL("/", origin));
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) redirect.headers.set("set-cookie", setCookie);
  return redirect;
}
