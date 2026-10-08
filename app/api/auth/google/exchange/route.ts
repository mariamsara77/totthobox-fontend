import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.code || typeof body.code !== "string") {
    return NextResponse.json(
      { message: "Google authentication code is required." },
      { status: 422 },
    );
  }

  const { status, data } = await laravelJson("/v1/auth/google/exchange", {
    method: "POST",
    body: JSON.stringify({ code: body.code }),
  });

  if (
    status < 200 ||
    status >= 300 ||
    !data?.access_token ||
    !data?.refresh_token
  ) {
    const response = NextResponse.json(
      data ?? { message: "Google login could not be completed." },
      { status: status >= 400 ? status : 502 },
    );

    if (status === 401 || status === 403) {
      clearAuthCookies(response);
    }

    return response;
  }

  const response = NextResponse.json({ user: data.user });
  setAuthCookies(response, data.access_token, data.refresh_token);
  return response;
}
