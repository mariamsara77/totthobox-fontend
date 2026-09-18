"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Link from "next/link";

type LoginModalProps = {
  open: boolean;
  reason?: string;
  onClose: () => void;
  onLoginSuccess: () => Promise<void>;
};

export default function LoginModal({
  open,
  reason,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const { login } = useAuth();
  const titleId = useId();
  const descriptionId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => emailRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [open, loading, onClose]);

  useEffect(() => {
    if (!open) return;
    setError("");
  }, [open]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError("ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(normalizedEmail, password);
      await onLoginSuccess();
    } catch (err: any) {
      const message =
        err?.errors?.email?.[0] ||
        err?.errors?.password?.[0] ||
        err?.message ||
        "লগইন করা যায়নি। তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-400/25 bg-white shadow-2xl dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-400/25 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold tracking-tight">
              লগইন করুন
            </h2>
            <p
              id={descriptionId}
              className="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
            >
              {reason || "আপনার অ্যাকাউন্টে চালিয়ে যেতে লগইন করুন।"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="লগইন বন্ধ করুন"
            className="shrink-0 rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-400/10 hover:text-zinc-900 disabled:opacity-50 dark:hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          <GoogleLoginButton onLoginSuccess={onLoginSuccess} />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-400/25" />
            <span className="text-xs text-zinc-500">অথবা</span>
            <div className="h-px flex-1 bg-zinc-400/25" />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-3 py-2.5 text-sm leading-6"
            >
              {error}
            </div>
          )}

          <form onSubmit={submit} noValidate className="space-y-3">
            <input
              ref={emailRef}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="ইমেইল অ্যাড্রেস"
              aria-label="ইমেইল অ্যাড্রেস"
              className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="পাসওয়ার্ড"
                aria-label="পাসওয়ার্ড"
                className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                onClick={onClose}
                className="text-xs text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/register"
              onClick={onClose}
              className="font-semibold text-zinc-900 hover:underline dark:text-white"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
