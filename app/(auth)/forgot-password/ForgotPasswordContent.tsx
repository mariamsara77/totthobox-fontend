"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, ExternalLink, KeyRound, ArrowLeft } from "lucide-react";
import { getMailProviderUrl } from "@/lib/email-provider";

type FieldErrors = Record<string, string>;

function responseMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

function validationErrors(data: unknown): FieldErrors {
  if (!data || typeof data !== "object") return {};
  const errors = (data as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return {};

  return Object.fromEntries(
    Object.entries(errors as Record<string, unknown>).map(([key, value]) => [
      key,
      Array.isArray(value) && typeof value[0] === "string"
        ? value[0]
        : "অবৈধ তথ্য।",
    ]),
  );
}

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: "ইমেইল দিতে হবে।" });
      return;
    }
    if (!isEmailValid) {
      setErrors({ email: "সঠিক ইমেইল ফরম্যাট দিন।" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 422) {
        const nextErrors = validationErrors(data);
        setErrors(nextErrors);
        toast.error(
          responseMessage(data, "দয়া করে তথ্যের ভুলগুলো সংশোধন করুন।"),
        );
        return;
      }

      if (!res.ok) {
        toast.error(
          responseMessage(
            data,
            "পাসওয়ার্ড রিসেট লিংক পাঠানো যায়নি। আবার চেষ্টা করুন।",
          ),
        );
        return;
      }

      setSent(true);
      toast.success(
        responseMessage(data, "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।"),
      );
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const mailProviderUrl = isEmailValid ? getMailProviderUrl(email) : null;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="flex flex-col items-center mb-6">
        <div className="rounded-full bg-zinc-400/10 p-3 mb-2">
          <KeyRound size={28} className="text-zinc-600 dark:text-zinc-300" />
        </div>
        <h1 className="text-2xl font-bold">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="text-center text-sm opacity-50 mt-1">
          আপনার অ্যাকাউন্টের ইমেইল ঠিকানা দিন। আমরা আপনাকে পাসওয়ার্ড রিসেট লিংক পাঠিয়ে দেব।
        </p>
      </div>

      {sent ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 text-sm">
            <p className="font-medium">রিসেট লিংক পাঠানো হয়েছে</p>
            <p className="mt-1 opacity-70">
              <strong className="opacity-100">{email}</strong> এই ঠিকানায় পাসওয়ার্ড রিসেট করার নির্দেশনা পাঠানো হয়েছে। ইনবক্স চেক করুন।
            </p>
          </div>

          {mailProviderUrl && (
            <a
              href={mailProviderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-full border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 hover:bg-zinc-400/25 transition text-sm font-medium"
            >
              <Mail size={16} />
              <span>ইমেইল ইনবক্স খুলুন</span>
              <ExternalLink size={14} className="opacity-60" />
            </a>
          )}

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-sm opacity-60 hover:opacity-100 transition"
            >
              অন্য ইমেইল দিন
            </button>
            <span className="opacity-30">•</span>
            <Link
              href="/login"
              className="text-sm font-semibold hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              লগইন পেজে ফিরুন
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              ইমেইল ঠিকানা <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="example@gmail.com"
              className={`w-full rounded-2xl border px-4 py-2.5 text-sm transition outline-none ${
                errors.email
                  ? "border-red-500 bg-red-500/5 focus:border-red-500"
                  : "border-zinc-400/25 bg-zinc-400/10 focus:border-zinc-400/50"
              }`}
              disabled={loading}
              autoFocus
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-zinc-400/25 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>পাঠানো হচ্ছে...</span>
              </>
            ) : (
              <span>রিসেট লিংক পাঠান</span>
            )}
          </button>

          <p className="text-center text-sm opacity-50 mt-6">
            পাসওয়ার্ড মনে পড়েছে?{" "}
            <Link
              href="/login"
              className="font-bold text-zinc-950 dark:text-white hover:underline"
            >
              লগ ইন করুন
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
