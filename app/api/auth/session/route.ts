import { NextResponse } from "next/server";
import { NO_STORE_HEADERS } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Legacy endpoint kept temporarily for backward compatibility.
 * Production authentication uses:
 *
 * Google -> Laravel callback -> /auth/callback?code=... ->
 * /api/auth/google/exchange -> HttpOnly cookie -> /api/auth/me
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "এই authentication endpoint আর ব্যবহার করা হয় না।",
    },
    {
      status: 410,
      headers: NO_STORE_HEADERS,
    },
  );
}
