"use client";

<<<<<<< HEAD
// components/GoogleLoginButton.tsx
// ─────────────────────────────────────────────────────────────────
// Google Login Button — যেকোনো জায়গায় use করো
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { getGoogleRedirectUrl } from "@/lib/auth";

interface Props {
  label?: string;
  className?: string;
}

export function GoogleLoginButton({
  label = "Google দিয়ে লগইন করুন",
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = await getGoogleRedirectUrl();
      window.location.href = url; // Google OAuth page-এ যাও
    } catch (err) {
      console.error("Google redirect failed:", err);
      setError("Google লগইন শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleLogin}
        disabled={loading}
        className={[
          "w-full flex items-center justify-center gap-3 px-4 py-3",
          "border border-gray-300 rounded-lg bg-white",
          "text-gray-700 font-medium text-sm",
          "hover:bg-gray-50 transition-colors duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className,
        ].join(" ")}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span>অপেক্ষা করুন…</span>
          </>
        ) : (
          <>
            {/* Google SVG icon */}
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
=======
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
>>>>>>> ac9bbca3285e829fe73ff75e9576e5cefa7f0200
  );
}
