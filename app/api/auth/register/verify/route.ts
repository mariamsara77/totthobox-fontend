import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const { status, data } = await laravelJson("/v1/auth/register/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (status < 200 || status >= 300) {
    return NextResponse.json(data, { status });
  }

  const response = NextResponse.json({ user: data!.user });
  setAuthCookie(response, data!.token);
  return response;
}