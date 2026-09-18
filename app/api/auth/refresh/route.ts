import { NextRequest, NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value ?? null;

  if (!refreshToken) {
    return NextResponse.json({ message: "সেশন শেষ হয়ে গেছে।" }, { status: 401 });
  }

  const { status, data } = await laravelJson("/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (status === 401 || status === 403) {
    const response = NextResponse.json(
      { message: "সেশন শেষ হয়ে গেছে।" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  if (status < 200 || status >= 300 || !data?.access_token) {
    return NextResponse.json(
      data ?? { message: "সেশন রিফ্রেশ করা যায়নি।" },
      { status: status >= 400 ? status : 502 },
    );
  }

  const response = NextResponse.json({ user: data.user });
  setAuthCookies(response, data.access_token, data.refresh_token);
  return response;
}
