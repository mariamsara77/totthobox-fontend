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
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!token) {
      toast.error("Google লগইন টোকেন পাওয়া যায়নি");
      router.replace("/login?error=missing-google-token");
      return;
    }

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
