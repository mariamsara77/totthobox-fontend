import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/session";
import { laravelFetch } from "@/lib/server/laravel";

export async function GET(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
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

  try {
    const res = await laravelFetch(`/notifications?${query.toString()}`, {
      token,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("notifications proxy error:", e);
    return NextResponse.json(
      { message: "Backend connection failed" },
      { status: 502 },
    );
  }
}

export async function DELETE() {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const res = await laravelFetch("/notifications", {
    method: "DELETE",
    token,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}