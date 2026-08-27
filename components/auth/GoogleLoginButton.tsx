"use client";

import { useState } from "react";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (isLoading) return;

    setIsLoading(true);
    window.location.assign("/api/auth/google/redirect");
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isLoading}
      aria-busy={isLoading}
      className="w-full flex items-center justify-center gap-4 rounded-full p-4 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed bg-orange-400"
    >
      <span className="text-xl font-bold" aria-hidden="true">
        G
      </span>
      {isLoading ? "Google লগইন শুরু হচ্ছে..." : "গুগল দিয়ে লগইন করুন"}
    </button>
  );
}
