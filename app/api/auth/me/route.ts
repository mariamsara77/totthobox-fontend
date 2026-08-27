import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  NO_STORE_HEADERS,
  getAuthToken,
  verifyToken,
} from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
  }

  let laravelRes: Response;
  try {
    laravelRes = await verifyToken(token);
  } catch {
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভার অনুপলব্ধ।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const data = await laravelRes.json().catch(() => null);

  if (laravelRes.status === 401) {
    const response = NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  if (!laravelRes.ok) {
    return NextResponse.json(null, {
      status: laravelRes.status,
      headers: NO_STORE_HEADERS,
    });
  }

  if (!data || typeof data !== "object" || !("id" in data)) {
    const response = NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.json(data, {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}
