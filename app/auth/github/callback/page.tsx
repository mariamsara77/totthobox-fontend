"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function GithubCallbackContent() {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      window.opener?.postMessage(
        {
          type: "github-auth-error",
          message: "GitHub লগইন বাতিল হয়েছে",
        },
        window.location.origin,
      );
      window.close();
      return;
    }

    if (!code) {
      window.opener?.postMessage(
        {
          type: "github-auth-error",
          message: "GitHub authentication code পাওয়া যায়নি",
        },
        window.location.origin,
      );
      window.close();
      return;
    }

    // Backend-এ code পাঠিয়ে access_token নেওয়া
    fetch("/api/v1/auth/github/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          window.opener?.postMessage(
            {
              type: "github-auth-success",
              access_token: data.access_token,
            },
            window.location.origin,
          );
        } else {
          window.opener?.postMessage(
            {
              type: "github-auth-error",
              message: data.message || "GitHub লগইন ব্যর্থ হয়েছে",
            },
            window.location.origin,
          );
        }
        window.close();
      })
      .catch(() => {
        window.opener?.postMessage(
          {
            type: "github-auth-error",
            message: "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          },
          window.location.origin,
        );
        window.close();
      });
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          GitHub দিয়ে লগইন হচ্ছে...
        </p>
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-sm text-zinc-500">লোড হচ্ছে...</p>
        </div>
      }
    >
      <GithubCallbackContent />
    </Suspense>
  );
}
