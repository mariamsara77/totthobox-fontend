"use client";

<<<<<<< HEAD
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
=======
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google লগইন ব্যর্থ হয়েছে");
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code || code.length > 128) {
      toast.error("Google authentication code পাওয়া যায়নি");
      router.replace("/login?error=google-code-missing");
      return;
    }

    const establishSession = async () => {
      try {
        const response = await fetch("/api/auth/google/exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ code }),
        });

        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            payload &&
            typeof payload === "object" &&
            payload !== null &&
            "message" in payload &&
            typeof (payload as { message?: unknown }).message === "string"
              ? (payload as { message: string }).message
              : "Google লগইন সম্পন্ন করা যায়নি";

          throw new Error(message);
        }

        toast.success("সফলভাবে লগইন হয়েছে!");

        // Remove the one-time code from the address bar and browser history.
        window.location.replace("/");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Google লগইন সম্পন্ন করা যায়নি",
        );
        router.replace("/login?error=google-session-failed");
      }
    };

    void establishSession();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          className="animate-spin h-10 w-10 border-4 border-zinc-400/25 border-t-zinc-400 rounded-full mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="text-zinc-400">লগইন সম্পন্ন হচ্ছে...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-zinc-400">লগইন ভেরিফাই করা হচ্ছে...</p>
        </main>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
>>>>>>> ac9bbca3285e829fe73ff75e9576e5cefa7f0200
