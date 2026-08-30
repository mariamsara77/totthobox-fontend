import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email) {
    return NextResponse.json({ message: "ইমেইল দিতে হবে।" }, { status: 422 });
  }

  const { status, data } = await laravelJson("/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: body.email }),
  });

  return NextResponse.json(data, { status });
}