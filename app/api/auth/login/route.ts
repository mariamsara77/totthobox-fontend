import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 422 },
    );
  }

  const { status, data } = await laravelJson("/v1/login", {
    method: "POST",
    body: JSON.stringify({ email: body.email, password: body.password }),
  });

  if (status < 200 || status >= 300) {
    return NextResponse.json(data ?? { message: "Login failed." }, { status });
  }

  const response = NextResponse.json({ user: data!.user });

  // access_token (1 দিন) + refresh_token (30 দিন) — দুটোই httpOnly cookie
  setAuthCookies(response, data!.access_token, data!.refresh_token);

  return response;
}