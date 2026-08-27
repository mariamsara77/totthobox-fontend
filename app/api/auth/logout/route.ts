import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  NO_STORE_HEADERS,
  getAuthToken,
  revokeToken,
} from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const token = await getAuthToken();
  await revokeToken(token);

  const response = NextResponse.json(
    { success: true },
    { status: 200, headers: NO_STORE_HEADERS }
  );
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
