import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const { status, data } = await laravelJson("/v1/auth/register/send-otp", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status });
}