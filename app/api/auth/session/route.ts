import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  NO_STORE_HEADERS,
  revokeToken,
  verifyToken,
} from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json(
      { message: "Authentication token অনুপস্থিত।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let verifyResponse: Response;
  try {
    verifyResponse = await verifyToken(token);
  } catch {
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভারের সাথে সংযোগ করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const user = await verifyResponse.json().catch(() => null);

  if (!verifyResponse.ok || !user || typeof user !== "object" || !("id" in user)) {
    return NextResponse.json(
      { message: "Authentication token অবৈধ বা মেয়াদ শেষ হয়েছে।" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (previousToken && previousToken !== token) {
    await revokeToken(previousToken);
  }

  const response = NextResponse.json(
    { success: true, user },
    { status: 200, headers: NO_STORE_HEADERS }
  );
  response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
  return response;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", origin));
  }

  return NextResponse.redirect(
    new URL(`/auth/callback?token=${encodeURIComponent(token)}`, origin)
  );
}
