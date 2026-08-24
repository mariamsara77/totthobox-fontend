import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("laravel_token")?.value;

  // Best-effort: tell Laravel to invalidate the token too
  if (token) {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    } catch {
      // If Laravel is unreachable we still clear the cookie locally
    }
  }

  const res = NextResponse.json({ success: true }, { status: 200 });

  // Clear the httpOnly cookie
  res.cookies.set("laravel_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return res;
}