"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

function GithubCallbackContent() {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);
  const [statusMessage, setStatusMessage] = useState<string>("GitHub দিয়ে লগইন সম্পন্ন হচ্ছে...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Clean sensitive OAuth parameters from browser URL history immediately
    try {
      if (typeof window !== "undefined" && window.history?.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    } catch {
      // Ignore history API errors
    }

    const broadcastAndComplete = (
      type: "github-auth-success" | "github-auth-error",
      payload: { code?: string; state?: string | null; message?: string },
    ) => {
      const messageData = { type, ...payload, timestamp: Date.now() };

      // 1. Direct window.opener postMessage (with strict origin matching)
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(messageData, window.location.origin);
        }
      } catch {
        // window.opener might be blocked by browser policy
      }

      // 2. BroadcastChannel for cross-context / popup communication
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const channel = new BroadcastChannel("totthobox-auth");
          channel.postMessage(messageData);
          channel.close();
        }
      } catch {
        // BroadcastChannel unavailable
      }

      // 3. Storage event fallback for browsers where BroadcastChannel is unsupported or partitioned
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("totthobox_auth_event", JSON.stringify(messageData));
          setTimeout(() => {
            try {
              localStorage.removeItem("totthobox_auth_event");
            } catch {}
          }, 1500);
        }
      } catch {
        // localStorage disabled or unavailable
      }

      if (type === "github-auth-success") {
        setStatusMessage("সফলভাবে সংযুক্ত হয়েছে! উইন্ডো বন্ধ করা হচ্ছে...");
        // Delay window.close slightly to allow Chromium/WebKit to flush message queues
        setTimeout(() => {
          try {
            window.close();
          } catch {}

          // If window.close() was blocked by browser (e.g. not opened as popup), redirect home
          setTimeout(() => {
            if (typeof window !== "undefined" && !window.closed) {
              window.location.href = "/";
            }
          }, 800);
        }, 200);
      } else {
        setErrorMessage(payload.message || "GitHub লগইন ব্যর্থ হয়েছে।");
        setTimeout(() => {
          if (typeof window !== "undefined" && !window.closed) {
            window.location.href = "/login";
          }
        }, 2500);
      }
    };

    if (error) {
      broadcastAndComplete("github-auth-error", {
        message:
          errorDescription ||
          "GitHub লগইন বাতিল হয়েছে বা অনুমোদন দেওয়া হয়নি।",
      });
      return;
    }

    if (!code) {
      broadcastAndComplete("github-auth-error", {
        message: "GitHub authentication code পাওয়া যায়নি।",
      });
      return;
    }

    broadcastAndComplete("github-auth-success", { code, state });
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 p-4">
      <div className="text-center max-w-sm">
        {errorMessage ? (
          <div className="text-red-500 space-y-2">
            <p className="font-medium text-sm">{errorMessage}</p>
            <p className="text-xs text-zinc-500">লগইন পেজে ফিরিয়ে নেওয়া হচ্ছে...</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {statusMessage}
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
