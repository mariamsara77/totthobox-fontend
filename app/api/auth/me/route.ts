import { NextRequest, NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { clearAuthCookies } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value ?? null;

  if (!token) return NextResponse.json({ user: null });

  const { status, data } = await laravelJson("/v1/user", { token });

  if (status !== 200) {
    const response = NextResponse.json({ user: null });
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.json({ user: data!.user });
}