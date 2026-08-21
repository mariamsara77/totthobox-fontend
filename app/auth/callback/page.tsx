"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-800">
          লগইন সফল হচ্ছে...
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          দয়া করে একটু অপেক্ষা করুন।
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <p className="text-sm text-zinc-500">অপেক্ষা করুন...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
