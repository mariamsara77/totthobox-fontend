"use client";

import { useState } from "react";

export default function GoogleLoginButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleLogin = () => {
    if (isRedirecting) return;

    setIsRedirecting(true);

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    ).replace(/\/$/, "");

    // OAuth is intentionally a full browser redirect. The Laravel callback
    // creates the same Sanctum-backed session used by normal login.
    window.location.assign(`${baseUrl}/api/auth/google/redirect`);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isRedirecting}
      aria-busy={isRedirecting}
      className="w-full flex items-center justify-center gap-4 rounded-full p-4 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed bg-orange-400"
    >
      <span className="text-xl font-bold" aria-hidden="true">
        G
      </span>
      {isRedirecting ? "Google লগইনে নেওয়া হচ্ছে..." : "গুগল দিয়ে লগইন করুন"}
    </button>
  );
}
