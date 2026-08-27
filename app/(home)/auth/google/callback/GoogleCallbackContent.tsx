"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function GoogleCallbackContent() {
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

    if (!code) {
      toast.error("Google authentication code পাওয়া যায়নি");
      router.replace("/login?error=missing-google-code");
      return;
    }

    // The browser only carries a short-lived, one-time code here.
    // The real Sanctum token is obtained and stored by the Next.js server.
    void fetch("/api/auth/google/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ code }),
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (response.ok) {
          window.location.replace("/");
          return;
        }

        const data = await response.json().catch(() => null);
        const message = typeof data?.message === "string" ? data.message : "Google লগইন ব্যর্থ হয়েছে";
        throw new Error(message);
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Google লগইন ব্যর্থ হয়েছে");
        router.replace("/login?error=google-session-failed");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-zinc-400/25 border-t-zinc-400 rounded-full mx-auto mb-4" />
        <p className="text-zinc-400">লগইন সম্পন্ন হচ্ছে...</p>
      </div>
    </div>
  );
}
