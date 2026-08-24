import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

function clearTokenCookie(res: NextResponse) {
  res.cookies.set("laravel_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("laravel_token")?.value;

  // No token at all — respond 401 immediately (do NOT hit Laravel)
  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/user`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    // Network failure — don't invalidate the cookie, just return 503
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভার অনুপলব্ধ।" },
      { status: 503 }
    );
  }

  const data = await laravelRes.json().catch(() => null);

  // Token expired or invalid — clear cookie so the client stops retrying
  if (laravelRes.status === 401) {
    const res = NextResponse.json(null, { status: 401 });
    clearTokenCookie(res);
    return res;
  }

  if (!laravelRes.ok) {
    return NextResponse.json(null, { status: laravelRes.status });
  }

  // Sanity check — make sure we got a real user object back
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    const res = NextResponse.json(null, { status: 401 });
    clearTokenCookie(res);
    return res;
  }

  return NextResponse.json(data, { status: 200 });
}