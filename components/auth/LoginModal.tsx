"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import BrandIcon from "../BrandIcon";

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
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => emailRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!loadingRef.current) onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
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
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      await login(normalizedEmail, password);
      await onLoginSuccess();
    } catch (err: unknown) {
      const data =
        typeof err === "object" && err !== null
          ? (err as {
              errors?: {
                email?: string[];
                password?: string[];
              };
              message?: string;
            })
          : null;

      setError(
        data?.errors?.email?.[0] ||
          data?.errors?.password?.[0] ||
          data?.message ||
          "লগইন করা যায়নি। তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।",
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="login-modal"
          className="fixed inset-0 z-100 flex min-h-dvh items-center justify-center overflow-y-auto p-3 sm:p-5"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-zinc-400/25 shadow-2xl backdrop-blur-xl "
          >
            <div className="relative border-b border-zinc-400/25 px-4 pb-4 pt-5 sm:px-5">
              <div className="absolute inset-x-0 top-0 h-px bg-zinc-400/25" />

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="লগইন বন্ধ করুন"
                className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-400/10 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white"
              >
                <X className="size-5" />
              </button>

              <div className="pr-10 text-center">
                <div className="flex justify-center">
                  <Link
                    href="/"
                    className="mb-3 inline-flex size-14 items-center justify-center rounded-xl border border-zinc-400/25 bg-zinc-400/10"
                  >
                    <BrandIcon className="size-12" />
                  </Link>
                </div>
                <h2
                  id={titleId}
                  className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-2xl"
                >
                  লগইন করুন
                </h2>
                <p
                  id={descriptionId}
                  className="mt-1 text-sm leading-5 text-zinc-500 dark:text-zinc-400"
                >
                  {reason || "আপনার অ্যাকাউন্টে চালিয়ে যেতে লগইন করুন।"}
                </p>
              </div>
            </div>

            <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
              <GoogleLoginButton onLoginSuccess={onLoginSuccess} />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-400/20" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  অথবা
                </span>
                <div className="h-px flex-1 bg-zinc-400/20" />
              </div>

              {error && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm leading-5 text-red-700 dark:text-red-300"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={submit} noValidate className="space-y-3">
                <label className="block">
                  <span className="sr-only">ইমেইল অ্যাড্রেস</span>
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
                    className="w-full rounded-full border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400/50 focus:ring-2 focus:ring-zinc-400/10"
                  />
                </label>

                <div className="relative">
                  <label className="block">
                    <span className="sr-only">পাসওয়ার্ড</span>
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
                      className="w-full rounded-full border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 pr-11 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400/50 focus:ring-2 focus:ring-zinc-400/10"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                    }
                    className="absolute inset-y-0 right-2.5 flex items-center px-1 text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white"
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
                    className="text-xs font-medium text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-400/25 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
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
                  className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-white"
                >
                  সাইন আপ করুন
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
