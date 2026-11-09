"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

function GithubCallbackContent() {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    const notifyOpenerAndClose = (
      type: "github-auth-success" | "github-auth-error",
      payload: Record<string, unknown>,
    ) => {
      if (window.opener) {
        window.opener.postMessage({ type, ...payload }, window.location.origin);
        // Close immediately after postMessage — parent window handles token exchange
        window.close();
      } else {
        if (type === "github-auth-success") {
          window.location.href = "/";
        } else {
          setErrorMessage(
            (payload.message as string) || "GitHub লগইন ব্যর্থ হয়েছে।",
          );
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      }
    };

    if (error) {
      notifyOpenerAndClose("github-auth-error", {
        message:
          errorDescription ||
          "GitHub লগইন বাতিল হয়েছে বা অনুমোদন দেওয়া হয়নি।",
      });
      return;
    }

    if (!code) {
      notifyOpenerAndClose("github-auth-error", {
        message: "GitHub authentication code পাওয়া যায়নি।",
      });
      return;
    }

    // Send the code to the parent window; it handles the token exchange and
    // sets the auth cookies — avoids popup-close timing races where Set-Cookie
    // headers from a closing popup may not be committed before the parent reads them.
    notifyOpenerAndClose("github-auth-success", { code });
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 p-4">
      <div className="text-center max-w-sm">
        {errorMessage ? (
          <div className="text-red-500 space-y-2">
            <p className="font-medium">{errorMessage}</p>
            <p className="text-xs text-zinc-500">লগইন পেজে ফিরিয়ে নেওয়া হচ্ছে...</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              GitHub দিয়ে লগইন সম্পন্ন হচ্ছে...
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              অনুগ্রহ করে অপেক্ষা করুন, এই উইন্ডোটি স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে।
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">লোড হচ্ছে...</p>
        </div>
      }
    >
      <GithubCallbackContent />
    </Suspense>
  );
}
