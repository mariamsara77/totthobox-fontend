import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

function noStore<T extends NextResponse>(res: T): T {
  res.headers.set("Cache-Control", "private, no-store, no-cache, max-age=0, must-revalidate");
  return res;
}

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
    return noStore(NextResponse.json(null, { status: 401 }));
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });
  } catch {
    return noStore(
      NextResponse.json(
        { message: "ব্যাকএন্ড সার্ভার অনুপলব্ধ।" },
        { status: 503 }
      )
    );
  }

  const data = await laravelRes.json().catch(() => null);

  if (laravelRes.status === 401) {
    const res = NextResponse.json(null, { status: 401 });
    clearTokenCookie(res);
    return noStore(res);
  }

  if (!laravelRes.ok) {
    return noStore(NextResponse.json(null, { status: laravelRes.status }));
  }

  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    const res = NextResponse.json(null, { status: 401 });
    clearTokenCookie(res);
    return noStore(res);
  }

  return noStore(NextResponse.json(data, { status: 200 }));
}
