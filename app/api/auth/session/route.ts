import { NextResponse } from "next/server";
import { NO_STORE_HEADERS } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Google login no longer uses this endpoint.
 * Session establishment is performed exclusively by
 * /api/auth/google-callback so there is one auth pipeline.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "এই authentication endpoint আর ব্যবহার করা হয় না।",
    },
    { status: 410, headers: NO_STORE_HEADERS }
  );
}
