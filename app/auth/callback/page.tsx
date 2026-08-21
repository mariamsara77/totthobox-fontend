"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // টোকেনটি লোকাল স্টোরেজে বা কুকিতে সেভ করুন
      localStorage.setItem("auth_token", token);

      // সফলভাবে লগইন হওয়ার পর ড্যাশবোর্ড বা হোমপেজে পাঠিয়ে দিন
      router.push("/");
    } else {
      // টোকেন না থাকলে লগিন পেজে পাঠিয়ে দিন
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-800">
          লগইন সফল হচ্ছে...
        </h2>
        <p className="text-sm text-zinc-500 mt-2">দয়া করে একটু অপেক্ষা করুন।</p>
      </div>
    </div>
  );
}
