import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.access_token) {
    return NextResponse.json({ message: "Access token is required." }, { status: 400 });
  }

  const { status, data } = await laravelJson("/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ access_token: body.access_token }),
  });

  if (status < 200 || status >= 300) {
    return NextResponse.json(data ?? { message: "Google login failed." }, { status });
  }

  const response = NextResponse.json({ user: data!.user });
  setAuthCookie(response, data!.token);
  return response;
}