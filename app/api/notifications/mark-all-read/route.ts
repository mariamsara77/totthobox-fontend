export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/session";
import { laravelFetch } from "@/lib/server/laravel";

export async function POST() {
  const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 200, headers });
    }

    const res = await laravelFetch("/notifications/mark-all-read", {
      method: "POST",
      token,
    });

    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json(data, { status: 200, headers });
  } catch {
    return NextResponse.json({ success: false }, { status: 200, headers });
  }
}
