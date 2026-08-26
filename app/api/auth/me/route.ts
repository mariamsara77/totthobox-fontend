import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Vary: "Cookie, Authorization",
};

function clearTokenCookie(res: NextResponse) {
  res.cookies.set("laravel_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("laravel_token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401, headers: NO_STORE_HEADERS });
  }

  // Protect against an upstream proxy/CDN that caches authenticated GETs by
  // URL while ignoring Authorization. The raw token is never placed in the URL.
  const sessionKey = createHash("sha256")
    .update(token)
    .digest("hex")
    .slice(0, 32);

  let laravelRes: Response;
  try {
    laravelRes = await fetch(
      `${API_BASE}/api/user?session=${sessionKey}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store, no-cache, max-age=0",
          Pragma: "no-cache",
        },
        cache: "no-store",
      }
    );
  } catch {
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভার অনুপলব্ধ।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const data = await laravelRes.json().catch(() => null);

  if (laravelRes.status === 401) {
    const res = NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
    clearTokenCookie(res);
    return res;
  }

  if (!laravelRes.ok) {
    return NextResponse.json(null, {
      status: laravelRes.status,
      headers: NO_STORE_HEADERS,
    });
  }

  if (!data || typeof data !== "object" || !("id" in data)) {
    const res = NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
    clearTokenCookie(res);
    return res;
  }

  return NextResponse.json(data, {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}
