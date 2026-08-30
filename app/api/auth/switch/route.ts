import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = body?.token;

  if (!token) {
    return NextResponse.json({ message: "Token required" }, { status: 422 });
  }

  // Token দিয়ে ইউজার ভ্যালিড কিনা চেক
  const { status, data } = await laravelJson("/v1/user", { token });

  if (status !== 200 || !data?.user) {
    const response = NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
    clearAuthCookie(response);
    return response;
  }

  // Token valid → cookie সেট করে দিই
  const response = NextResponse.json({ user: data.user });
  setAuthCookie(response, token);
  return response;
}