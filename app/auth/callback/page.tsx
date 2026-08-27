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

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google লগইন ব্যর্থ হয়েছে");
      router.replace("/login?error=google-auth-failed");
      return;
    }

    if (!token) {
      toast.error("Google লগইন টোকেন পাওয়া যায়নি");
      router.replace("/login?error=missing-google-token");
      return;
    }

    const establishSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("google-session-failed");
        }

        toast.success("সফলভাবে লগইন হয়েছে!");

        // Replace the callback URL so the Sanctum token is removed from the
        // address bar and browser history before the authenticated app loads.
        window.location.replace("/");
      } catch {
        toast.error("Google লগইন সম্পন্ন করা যায়নি");
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
