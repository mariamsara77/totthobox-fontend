import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.token || !body?.email || !body?.password) {
    return NextResponse.json({ message: "সব ফিল্ড পূরণ করুন।" }, { status: 422 });
  }

  const { status, data } = await laravelJson("/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token: body.token,
      email: body.email,
      password: body.password,
      password_confirmation: body.password_confirmation,
    }),
  });

  if (status < 200 || status >= 300) {
    return NextResponse.json(data, { status });
  }

  if (!data?.access_token || !data?.refresh_token) {
    return NextResponse.json(
      { message: "Password reset session could not be established." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ success: true, user: data.user });
  setAuthCookies(response, data.access_token, data.refresh_token);
  return response;
}