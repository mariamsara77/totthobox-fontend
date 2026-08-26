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

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google লগইন ব্যর্থ হয়েছে");
      router.replace("/login");
      return;
    }

    if (!token) {
      toast.error("Google লগইন টোকেন পাওয়া যায়নি");
      router.replace("/login");
      return;
    }

    // The Laravel OAuth callback returns a short-lived-in-URL Sanctum token.
    // Exchange it immediately for the same HttpOnly session cookie used by
    // normal email/password authentication. Never persist the token in
    // localStorage/sessionStorage and never keep it in the browser URL.
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
          throw new Error("session-establishment-failed");
        }

        // Replace the OAuth callback URL so the token is removed from browser
        // history/address bars before the authenticated app is loaded.
        toast.success("সফলভাবে লগইন হয়েছে!");
        window.location.replace("/");
      } catch {
        toast.error("Google লগইন সম্পন্ন করা যায়নি");
        router.replace("/login?error=google_session_failed");
      }
    };

    void establishSession();
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
