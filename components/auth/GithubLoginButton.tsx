"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getGithubClientId, getGithubRedirectUri } from "@/lib/auth-config";

type Props = {
  onLoginSuccess?: () => void | Promise<void>;
};

export default function GithubLoginButton({ onLoginSuccess }: Props) {
  const { mutateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handledRef = useRef(false);
  const activeListenersRef = useRef<(() => void) | null>(null);

  const cleanupListeners = () => {
    if (activeListenersRef.current) {
      activeListenersRef.current();
      activeListenersRef.current = null;
    }
  };

  const cleanup = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    cleanupListeners();
    popupRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanup();
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const handleGithubLogin = () => {
    setLoading(true);
    setError(null);
    handledRef.current = false;
    cleanup();

    const clientId = getGithubClientId();
    if (!clientId) {
      setError("GitHub লগইন ক্লায়েন্ট আইডি সেট করা নেই।");
      setLoading(false);
      return;
    }

    const redirectUri = getGithubRedirectUri();

    // Generate random state for CSRF defense
    const state =
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36);
    try {
      sessionStorage.setItem("github_oauth_state", state);
    } catch {
      // sessionStorage unavailable
    }

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      clientId,
    )}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=read:user%20user:email&state=${encodeURIComponent(state)}`;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      githubAuthUrl,
      "github-oauth-login",
      `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`,
    );

    if (!popup) {
      setError("পপআপ উইন্ডো খুলতে সমস্যা হয়েছে। অনুগ্রহ করে ব্রাউজারের পপআপ ব্লকার বন্ধ করুন।");
      setLoading(false);
      return;
    }

    popupRef.current = popup;

    // Process OAuth completion payload
    const handleAuthResult = async (data: {
      type: string;
      code?: string;
      state?: string | null;
      message?: string;
    }) => {
      if (handledRef.current) return;
      handledRef.current = true;
      cleanup();

      if (data.type === "github-auth-error") {
        setError(data.message || "GitHub সাইন ইন বাতিল হয়েছে বা ব্যর্থ হয়েছে।");
        setLoading(false);
        return;
      }

      if (data.type === "github-auth-success") {
        try {
          if (!data.code) {
            throw new Error("GitHub authorization code পাওয়া যায়নি। আবার চেষ্টা করুন।");
          }

          // Verify state match if present
          try {
            const expectedState = sessionStorage.getItem("github_oauth_state");
            if (expectedState && data.state && data.state !== expectedState) {
              throw new Error("নিরাপত্তা যাচাই ব্যর্থ হয়েছে (CSRF token mismatch)। আবার চেষ্টা করুন।");
            }
          } finally {
            sessionStorage.removeItem("github_oauth_state");
          }

          const res = await fetch("/api/auth/github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              code: data.code,
              redirect_uri: redirectUri,
            }),
          });

          if (!res.ok) {
            const resData = await res.json().catch(() => null);
            throw new Error(
              resData?.message || "GitHub লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
            );
          }

          // Session cookies are now set — refresh user and UI
          await mutateUser();
          router.refresh();
          await onLoginSuccess?.();
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "GitHub লগইন সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          );
        } finally {
          setLoading(false);
        }
      }
    };

    // Channel 1: window.postMessage
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === "github-auth-success" ||
        event.data?.type === "github-auth-error"
      ) {
        void handleAuthResult(event.data);
      }
    };
    window.addEventListener("message", onMessage);

    // Channel 2: BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        broadcastChannel = new BroadcastChannel("totthobox-auth");
        broadcastChannel.onmessage = (event) => {
          if (
            event.data?.type === "github-auth-success" ||
            event.data?.type === "github-auth-error"
          ) {
            void handleAuthResult(event.data);
          }
        };
      } catch {
        broadcastChannel = null;
      }
    }

    // Channel 3: storage event fallback
    const onStorage = (event: StorageEvent) => {
      if (event.key === "totthobox_auth_event" && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (
            parsed?.type === "github-auth-success" ||
            parsed?.type === "github-auth-error"
          ) {
            void handleAuthResult(parsed);
          }
        } catch {
          // Ignore invalid JSON
        }
      }
    };
    window.addEventListener("storage", onStorage);

    activeListenersRef.current = () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
      if (broadcastChannel) {
        broadcastChannel.close();
        broadcastChannel = null;
      }
    };

    // Watch if user closes popup manually without completing
    pollTimerRef.current = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(pollTimerRef.current!);
        pollTimerRef.current = null;
        cleanupListeners();
        // Give 500ms grace period for asynchronous message delivery before resetting loading state
        setTimeout(() => {
          if (!handledRef.current) {
            setLoading(false);
          }
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={loading}
        onClick={handleGithubLogin}
        className="group flex w-full items-center justify-center gap-3 rounded-full border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-400/25 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-100"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
        ) : (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {loading ? "GitHub দিয়ে লগইন হচ্ছে..." : "GitHub দিয়ে সাইন ইন করুন"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-center text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
