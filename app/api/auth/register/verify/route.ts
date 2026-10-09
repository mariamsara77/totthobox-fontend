import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const { status, data } = await laravelJson("/v1/auth/register/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (status < 200 || status >= 300) {
    return NextResponse.json(data, { status });
  }

  if (!data?.access_token || !data?.refresh_token) {
    return NextResponse.json(
      { message: "Registration session could not be established." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ user: data.user });
  setAuthCookies(response, data.access_token, data.refresh_token);
  return response;
}