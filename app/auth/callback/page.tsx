"use client";

// app/auth/callback/page.tsx
// ─────────────────────────────────────────────────────────────────
// Google OAuth Callback Handler
// Laravel এখানে redirect করে: /auth/callback?token=xxxxx
// ─────────────────────────────────────────────────────────────────

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUserFromToken } = useAuth();
  const processed = useRef(false); // double-call guard

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("message");

    if (error || !token) {
      console.error("Google auth failed:", error);
      router.replace("/login?error=google_auth_failed");
      return;
    }

    setUserFromToken(token)
      .then(() => {
        router.replace("/dashboard");
      })
      .catch((err) => {
        console.error("Token validation failed:", err);
        router.replace("/login?error=token_invalid");
      });
  }, [searchParams, router, setUserFromToken]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-600 text-sm">Google দিয়ে লগইন হচ্ছে…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
