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
    return NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/user`, {
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
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const text = await response.text();
  let payload: unknown = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (response.status === 401) {
    const result = NextResponse.json(null, {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
    clearAuthCookie(result);
    return result;
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: "Authentication session যাচাই করা যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }

  const user = extractUser(payload);

  if (!user) {
    const result = NextResponse.json(
      { message: "বর্তমান ব্যবহারকারীর তথ্য পাওয়া যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(result);
    return result;
  }

  return NextResponse.json(user, {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}
