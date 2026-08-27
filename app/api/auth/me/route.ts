import { NextResponse } from "next/server";
import {
  API_BASE,
  NO_STORE_HEADERS,
  clearAuthCookie,
  extractUser,
  getServerToken,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const token = await getServerToken();

  if (!token) {
    return NextResponse.json(null, { status: 401, headers: NO_STORE_HEADERS });
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/v1/me`, {
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
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভার অনুপলব্ধ।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const text = await laravelRes.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (laravelRes.status === 401) {
    const response = NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
    clearAuthCookie(response);
    return response;
  }

  if (!laravelRes.ok) {
    return NextResponse.json(null, {
      status: 502,
      headers: NO_STORE_HEADERS,
    });
  }

  const user = extractUser(payload);
  if (!user) {
    const response = NextResponse.json(null, {
      status: 502,
      headers: NO_STORE_HEADERS,
    });
    clearAuthCookie(response);
    return response;
  }

  return NextResponse.json(user, {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}
