// components/auth/FacebookLoginButton.tsx
"use client";

import { useState } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useAuth } from "@/context/AuthContext";

type Props = {
  onLoginSuccess?: () => void | Promise<void>;
};

export default function FacebookLoginButton({ onLoginSuccess }: Props) {
  const { mutateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  if (!appId) {
    return (
      <p className="text-center text-sm text-zinc-500">
        Facebook লগইন কনফিগার করা নেই।
      </p>
    );
  }

  return (
    <div className="w-full">
      <FacebookLogin
        appId={appId}
        onSuccess={async (response) => {
          setLoading(true);
          setError(null);

          try {
            const res = await fetch("/api/auth/facebook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                access_token: response.accessToken,
              }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
              throw new Error(data?.message || "Facebook লগইন ব্যর্থ");
            }

            await mutateUser();
            await onLoginSuccess?.();
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Facebook লগইন ব্যর্থ",
            );
          } finally {
            setLoading(false);
          }
        }}
        onFail={() => {
          setError("Facebook লগইন বাতিল হয়েছে");
          setLoading(false);
        }}
        render={({ onClick }) => (
          <button
            type="button"
            disabled={loading}
            onClick={onClick}
            className="group flex w-full items-center justify-center gap-3 rounded-full border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm font-semibold..."
          >
            {/* Facebook icon + text */}
            {loading
              ? "Facebook দিয়ে লগইন হচ্ছে..."
              : "Facebook দিয়ে সাইন ইন করুন"}
          </button>
        )}
      />

      {error && (
        <p className="mt-2 text-center text-sm text-zinc-500">{error}</p>
      )}
    </div>
  );
}
