import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies } from "@/lib/auth/session";

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

  if (!data?.access_token || !data?.refresh_token) {
    return NextResponse.json(
      { message: "Google login response was incomplete." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ user: data.user });
  setAuthCookies(response, data.access_token, data.refresh_token);
  return response;
}