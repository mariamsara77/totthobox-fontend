// components/auth/GithubLoginButton.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  onLoginSuccess?: () => void | Promise<void>;
};

export default function GithubLoginButton({ onLoginSuccess }: Props) {
  const { mutateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = () => {
    setLoading(true);
    setError(null);

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;

    // GitHub OAuth URL
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=user:email`;

    // Popup খোলা
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      githubAuthUrl,
      "github-login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    // Popup থেকে message শোনা
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "github-auth-success") {
        const { access_token } = event.data;

        try {
          const res = await fetch("/api/auth/github", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ access_token }),
          });

          const data = await res.json().catch(() => null);

          if (!res.ok) {
            throw new Error(data?.message || "GitHub লগইন ব্যর্থ হয়েছে");
          }

          await mutateUser();
          await onLoginSuccess?.();
        } catch (err) {
          setError(err instanceof Error ? err.message : "GitHub লগইন ব্যর্থ");
        } finally {
          setLoading(false);
          window.removeEventListener("message", handleMessage);
          popup?.close();
        }
      }

      if (event.data?.type === "github-auth-error") {
        setError(event.data.message || "GitHub লগইন বাতিল হয়েছে");
        setLoading(false);
        window.removeEventListener("message", handleMessage);
        popup?.close();
      }
    };

    window.addEventListener("message", handleMessage);
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
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
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
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {error}
        </p>
      )}
    </div>
  );
}
