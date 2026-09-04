import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/session";
import { laravelFetch } from "@/lib/server/laravel";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { id } = await params;

  const res = await laravelFetch(`/notifications/${id}/read`, {
    method: "POST",
    token,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}