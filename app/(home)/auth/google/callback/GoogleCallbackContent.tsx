"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google লগইন ব্যর্থ হয়েছে");
      router.replace("/login");
      return;
    }

    if (token) {
      toast.success("সফলভাবে লগইন হয়েছে!");
      window.location.assign(`/api/auth/session?token=${encodeURIComponent(token)}`);
    } else {
      toast.error("টোকেন পাওয়া যায়নি");
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-zinc-300">লগইন সম্পন্ন হচ্ছে...</p>
      </div>
    </div>
  );
}