import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

function clearTokenCookie(res: NextResponse) {
  res.cookies.set("laravel_token", "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
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
    // The old browser credential is still replaced by the new cookie below.
  }
}

async function setNewSession(token: string) {
  const cookieStore = await cookies();
  const previousToken = cookieStore.get("laravel_token")?.value;
  await revokePreviousToken(previousToken);

  const res = NextResponse.redirect(new URL("/", "http://localhost"));
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return res;
}

// GET /api/auth/session?token=xxx — used by OAuth callback redirects.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", origin));
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get("laravel_token")?.value;
  await revokePreviousToken(previousToken);

  const res = NextResponse.redirect(new URL("/", origin));
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return res;
}

// POST /api/auth/session — used by OAuth clients that receive a token.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json(
      { message: "token অনুপস্থিত।" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get("laravel_token")?.value;
  await revokePreviousToken(previousToken);

  const res = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );
  res.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return res;
}
