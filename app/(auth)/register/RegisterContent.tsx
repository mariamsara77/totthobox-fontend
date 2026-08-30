"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Mail,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
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
        : typeof value === "string"
          ? value
          : "অবৈধ তথ্য।",
    ]),
  );
}

const RESEND_COOLDOWN = 30;

export default function RegisterContent() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isNameValid = name.length >= 3 && name.length <= 50;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isConfirmValid =
    passwordConfirmation === password && passwordConfirmation.length > 0;

  const emailUrl = getMailProviderUrl(email);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "নাম দিতে হবে।";
    else if (!isNameValid) nextErrors.name = "নাম ৩-৫০ অক্ষরের মধ্যে হতে হবে।";

    if (!email.trim()) nextErrors.email = "ইমেইল দিতে হবে।";
    else if (!isEmailValid) nextErrors.email = "সঠিক ইমেইল ফরম্যাট দিন।";

    if (!password) nextErrors.password = "পাসওয়ার্ড দিতে হবে।";
    else if (!isPasswordValid)
      nextErrors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";

    if (!passwordConfirmation)
      nextErrors.password_confirmation = "পাসওয়ার্ড নিশ্চিত করুন।";
    else if (!isConfirmValid)
      nextErrors.password_confirmation = "পাসওয়ার্ড মিলছে না।";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 422) setErrors(validationErrors(data));
        else toast.error(responseMessage(data, "কিছু একটা ভুল হয়েছে।"));
        return;
      }

      toast.success(responseMessage(data, "ভেরিফিকেশন কোড পাঠানো হয়েছে।"));
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      toast.error("সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);

    try {
      const response = await fetch("/api/auth/register/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        toast.error(responseMessage(data, "কোড পাঠাতে সমস্যা হয়েছে।"));
        return;
      }

      toast.success(responseMessage(data, "নতুন কোড পাঠানো হয়েছে।"));
      setCooldown(RESEND_COOLDOWN);
    } catch {
      toast.error("সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    if (otp.length !== 4) {
      setErrors({ otp: "৪ ডিজিটের কোড দিন।" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 422) setErrors(validationErrors(data));
        else
          toast.error(responseMessage(data, "ভেরিফিকেশন সম্পন্ন করা যায়নি।"));
        return;
      }

      toast.success(responseMessage(data, "অ্যাকাউন্ট তৈরি হয়েছে।"));
      window.location.replace("/");
    } catch {
      toast.error("সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl">
          {step === "form" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "ইমেইল ভেরিফাই করুন"}
        </h1>
        <p className="text-sm opacity-50">
          {step === "form"
            ? "আপনার তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন"
            : "আপনার ইমেইলে পাঠানো ৪ ডিজিটের কোডটি দিন"}
        </p>
      </div>

      {step === "form" ? (
        <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="আপনার পূর্ণ নাম"
              autoComplete="name"
              className={clsx(
                "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                errors.name ? "border-red-500" : "border-transparent",
              )}
            />
            {name && isNameValid && !errors.name && (
              <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="ইমেইল (যেমন: name@example.com)"
              autoComplete="email"
              className={clsx(
                "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                errors.email ? "border-red-500" : "border-transparent",
              )}
            />
            {email && isEmailValid && !errors.email && (
              <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="পাসওয়ার্ড দিন"
              autoComplete="new-password"
              className={clsx(
                "w-full rounded-full py-3.5 px-6 pr-20 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                errors.password ? "border-red-500" : "border-transparent",
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {password && isPasswordValid && !errors.password && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 pl-4">
                {errors.password}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(event) => {
                setPasswordConfirmation(event.target.value);
                setErrors((prev) => ({ ...prev, password_confirmation: "" }));
              }}
              placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
              autoComplete="new-password"
              className={clsx(
                "w-full rounded-full py-3.5 px-6 pr-20 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                errors.password_confirmation
                  ? "border-red-500"
                  : "border-transparent",
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {passwordConfirmation &&
                (isConfirmValid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                ))}
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label={
                  showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1.5 pl-4">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition disabled:opacity-60"
          >
            {loading ? "পাঠানো হচ্ছে..." : "ভেরিফিকেশন কোড পাঠান"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6" noValidate>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <Mail size={16} /> <span>আমরা কোডটি পাঠিয়েছি:</span>
            </div>
            <a
              href={emailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
            >
              <span>{email}</span>
              <ExternalLink size={14} className="opacity-60" />
            </a>
            <p className="text-xs text-zinc-400 italic">
              ইনবক্স না পেলে স্প্যাম ফোল্ডার চেক করুন।
            </p>
          </div>

          <div className="flex justify-center">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, ""));
                setErrors((prev) => ({ ...prev, otp: "" }));
              }}
              placeholder="••••"
              className="w-48 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl py-4 border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          {errors.otp && (
            <p className="text-center text-red-500 text-sm">{errors.otp}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 4}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition disabled:opacity-60"
          >
            {loading ? "যাচাই করা হচ্ছে..." : "যাচাই ও অ্যাকাউন্ট তৈরি"}
          </button>

          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="opacity-50">কোড পাননি?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || resending}
              className="font-bold text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              {resending
                ? "পাঠানো হচ্ছে..."
                : cooldown > 0
                  ? `আবার পাঠান (${cooldown}s)`
                  : "আবার পাঠান"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep("form");
              setOtp("");
              setErrors({});
              setCooldown(0);
            }}
            className="w-full text-center text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            ভুল ইমেইল? তথ্য পরিবর্তন করুন
          </button>
        </form>
      )}

      {step === "form" && (
        <>
          <div className="my-4 flex items-center justify-center">
            <hr className="grow border-zinc-400/25" />
            <span className="mx-4 text-sm opacity-50">অথবা</span>
            <hr className="grow border-zinc-400/25" />
          </div>
          <GoogleLoginButton />
          <p className="text-center text-sm opacity-50 mt-8">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:underline"
            >
              লগ ইন করুন
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
