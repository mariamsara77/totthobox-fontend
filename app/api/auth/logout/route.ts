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
};

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("laravel_token")?.value;

  if (token) {
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
      // The local browser session is still revoked below.
    }
  }

  const response = NextResponse.json(
    { success: true },
    { status: 200, headers: NO_STORE_HEADERS }
  );

  response.cookies.set("laravel_token", "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
