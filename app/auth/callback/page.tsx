"use client";

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
