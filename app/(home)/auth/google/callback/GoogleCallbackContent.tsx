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
      router.replace("/login?error=google-auth-failed");
      return;
    }

    if (!token) {
      toast.error("Google লগইন টোকেন পাওয়া যায়নি");
      router.replace("/login?error=missing-google-token");
      return;
    }

    // Laravel currently redirects to /auth/callback?token=... . The browser
    // never stores the token. Hand it immediately to a Next.js server route,
    // where it is verified against Laravel and converted into an HttpOnly
    // session cookie before the user reaches the application.
    window.location.replace(
      `/api/auth/google-callback?token=${encodeURIComponent(token)}`
    );
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
