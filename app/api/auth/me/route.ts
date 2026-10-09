import { NextRequest, NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { clearAccessCookie } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value ?? null;

  if (!token) return NextResponse.json({ user: null });

  const { status, data } = await laravelJson("/v1/user", { token });

  if (status === 401 || status === 403) {
    const response = NextResponse.json({ user: null });
    clearAccessCookie(response);
    return response;
  }

  if (status < 200 || status >= 300 || !data?.user) {
    return NextResponse.json({ user: null }, { status: 503 });
  }

  return NextResponse.json({ user: data!.user });
}