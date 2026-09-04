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

export default function ForgotPasswordPage() {
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
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 422) setErrors(validationErrors(data));
        else toast.error(responseMessage(data, "লিংক পাঠাতে সমস্যা হয়েছে।"));
        return;
      }

      toast.success(responseMessage(data, "রিসেট লিংক পাঠানো হয়েছে।"));
      setSent(true);
    } catch {
      toast.error("সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    const emailUrl = getMailProviderUrl(email);

    return (
      <div className="space-y-6 text-center max-w-md mx-auto">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400">
          <Mail size={24} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">ইমেইল চেক করুন</h1>
          <p className="text-sm opacity-60">
            পাসওয়ার্ড রিসেট করার লিংক পাঠানো হয়েছে —
          </p>
          <div>
            <a
              href={emailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <span>{email}</span>
              <ExternalLink size={14} className="opacity-60" />
            </a>
          </div>
          <p className="text-xs text-zinc-400 italic">
            ইনবক্স না পেলে স্প্যাম ফোল্ডার চেক করুন।
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
        >
          <ArrowLeft size={14} />
          <span>লগ ইনে ফিরে যান</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="mx-auto mb-1 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400">
          <KeyRound size={24} />
        </div>
        <h1 className="text-2xl font-bold">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="text-sm opacity-50">
          আপনার ইমেইল দিন, রিসেট লিংক পাঠিয়ে দেব
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors({});
            }}
            placeholder="ইমেইল অ্যাড্রেস"
            autoComplete="email"
            className={`w-full rounded-xl border bg-zinc-400/10 px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-emerald-600 ${
              errors.email ? "border-rose-500" : "border-transparent"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-zinc-100 transition-colors hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
        </button>
      </form>

      <p className="text-center text-sm opacity-50">
        মনে পড়েছে?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          লগ ইন করুন
        </Link>
      </p>
    </div>
  );
}
