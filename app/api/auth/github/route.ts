import { NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    let githubAccessToken =
      typeof body?.access_token === "string" ? body.access_token.trim() : null;

    // If an authorization code was passed from GitHub OAuth redirect, exchange it with GitHub
    if (!githubAccessToken && body?.code && typeof body.code === "string") {
      const clientId =
        process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
        process.env.GITHUB_CLIENT_ID ||
        "Ov23li78Wl6unzKg6n59";
      const clientSecret =
        process.env.GITHUB_CLIENT_SECRET ||
        "1bfa14eba9bb4057ac80d36caee30eab4792204b";

      if (!clientId || !clientSecret) {
        return NextResponse.json(
          { message: "GitHub ক্লায়েন্ট ক্রেডেনশিয়াল সার্ভারে সঠিকভাবে সেট করা নেই।" },
          { status: 500 },
        );
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: body.code.trim(),
        }),
      });

      const tokenData = await tokenRes.json().catch(() => null);

      if (!tokenRes.ok || tokenData?.error || !tokenData?.access_token) {
        return NextResponse.json(
          {
            message:
              tokenData?.error_description ||
              tokenData?.error ||
              "GitHub অথেন্টিকেশন কোড যাচাই ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
          },
          { status: 400 },
        );
      }

      githubAccessToken = tokenData.access_token;
    }

    if (!githubAccessToken) {
      return NextResponse.json(
        { message: "GitHub access token বা authorization code প্রয়োজন।" },
        { status: 400 },
      );
    }

    // Authenticate with Laravel backend using the verified GitHub access token
    const { status, data } = await laravelJson("/v1/auth/github/login", {
      method: "POST",
      body: JSON.stringify({ access_token: githubAccessToken }),
    });

    if (status < 200 || status >= 300) {
      return NextResponse.json(
        data ?? { message: "GitHub দিয়ে অ্যাকাউন্টে প্রবেশ করা সম্ভব হয়নি।" },
        { status },
      );
    }

    if (!data?.access_token || !data?.refresh_token || !data?.user) {
      return NextResponse.json(
        { message: "GitHub লগইন সম্পন্ন করার জন্য সার্ভার থেকে সম্পূর্ণ তথ্য পাওয়া যায়নি।" },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      user: data.user,
      success: true,
      message: "GitHub লগইন সফল হয়েছে।",
    });

    setAuthCookies(response, data.access_token, data.refresh_token);
    return response;
  } catch (error) {
    console.error("GitHub auth API error:", error);
    return NextResponse.json(
      { message: "সার্ভারে সাময়িক সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      { status: 500 },
    );
  }
}
