export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/session";
import { laravelFetch } from "@/lib/server/laravel";

export async function GET(req: NextRequest) {
  const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { success: false, data: [], meta: { current_page: 1, per_page: 15, total: 0, has_more: false }, message: "Unauthenticated." },
        { status: 200, headers }
      );
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "15";

    const query = new URLSearchParams({
      filter,
      page,
      per_page: perPage,
    });

    const res = await laravelFetch(`/notifications?${query.toString()}`, {
      token,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, data: [], meta: { current_page: Number(page) || 1, per_page: Number(perPage) || 15, total: 0, has_more: false } },
        { status: 200, headers }
      );
    }

    const data = await res.json().catch(() => null);
    if (!data) {
      return NextResponse.json(
        { success: false, data: [], meta: { current_page: Number(page) || 1, per_page: Number(perPage) || 15, total: 0, has_more: false } },
        { status: 200, headers }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers,
    });
  } catch (e) {
    console.error("notifications proxy error:", e);
    return NextResponse.json(
      { success: false, data: [], meta: { current_page: 1, per_page: 15, total: 0, has_more: false }, message: "Backend connection failed" },
      { status: 200, headers }
    );
  }
}

export async function DELETE() {
  const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthenticated." }, { status: 200, headers });
    }

    const res = await laravelFetch("/notifications", {
      method: "DELETE",
      token,
    });

    const data = await res.json().catch(() => ({ success: true }));
    return NextResponse.json(data, { status: 200, headers });
  } catch {
    return NextResponse.json({ success: false }, { status: 200, headers });
  }
}
