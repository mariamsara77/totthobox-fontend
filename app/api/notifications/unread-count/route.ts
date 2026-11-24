export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/session";
import { laravelFetch } from "@/lib/server/laravel";

export async function GET() {
  const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ success: false, count: 0 }, { status: 200, headers });
    }

    const res = await laravelFetch("/notifications/unread-count", { token });
    if (!res.ok) {
      return NextResponse.json({ success: false, count: 0 }, { status: 200, headers });
    }

    const data = await res.json().catch(() => ({ count: 0 }));
    return NextResponse.json(data ?? { count: 0 }, { status: 200, headers });
  } catch (error) {
    console.warn("unread-count error:", error);
    return NextResponse.json({ success: false, count: 0 }, { status: 200, headers });
  }
}
