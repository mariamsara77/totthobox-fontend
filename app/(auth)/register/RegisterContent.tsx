"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function RegisterContent() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
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
  const isConfirmValid = passwordConfirmation === password && passwordConfirmation.length > 0;

  const emailUrl = (() => {
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain === "gmail.com") return "https://mail.google.com/";
    if (domain === "yahoo.com") return "https://mail.yahoo.com/";
    if (["outlook.com", "hotmail.com", "live.com"].includes(domain ?? "")) {
      return "https://outlook.live.com/";
    }
    if (domain === "icloud.com") return "https://www.icloud.com/mail";
    return `mailto:${email}`;
  })();

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/backend/auth/register/send-otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
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
    } catch {
      toast.error("সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 422) setErrors(validationErrors(data));
        else toast.error(responseMessage(data, "ভেরিফিকেশন সম্পন্ন করা যায়নি।"));
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
              onChange={(event) => setName(event.target.value)}
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
            {errors.name && <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.name}</p>}
          </div>

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
            {errors.email && <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="পাসওয়ার্ড দিন"
              autoComplete="new-password"
              className={clsx(
                "w-full rounded-full py-3.5 px-6 pr-20 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                errors.password ? "border-red-500" : "border-transparent",
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {password && isPasswordValid && !errors.password && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-zinc-400 hover:text-zinc-600" aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.password}</p>}
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
              autoComplete="new-password"
              className={clsx(
                "w-full rounded-full py-3.5 px-6 pr-20 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                errors.password_confirmation ? "border-red-500" : "border-transparent",
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {passwordConfirmation && (isConfirmValid ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />)}
              <button type="button" onClick={() => setShowConfirm((value) => !value)} className="text-zinc-400 hover:text-zinc-600" aria-label={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1.5 pl-4">{errors.password_confirmation}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition disabled:opacity-60">
            {loading ? "পাঠানো হচ্ছে..." : "ভেরিফিকেশন কোড পাঠান"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <Mail size={16} /> <span>আমরা কোডটি পাঠিয়েছি:</span>
            </div>
            <a href={emailUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium">
              {email} <ExternalLink size={14} className="opacity-60" />
            </a>
            <p className="text-xs text-zinc-400 italic">ইনবক্স না পেলে স্প্যাম ফোল্ডার চেক করুন।</p>
          </div>

          <div className="flex justify-center">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              className="w-48 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl py-4 border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          {errors.otp && <p className="text-center text-red-500 text-sm">{errors.otp}</p>}

          <button type="submit" disabled={loading || otp.length !== 4} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition disabled:opacity-60">
            {loading ? "যাচাই করা হচ্ছে..." : "যাচাই ও অ্যাকাউন্ট তৈরি"}
          </button>

          <button type="button" onClick={() => { setStep("form"); setOtp(""); setErrors({}); }} className="w-full text-center text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
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
            <Link href="/login" className="font-bold text-blue-600 hover:underline">লগ ইন করুন</Link>
          </p>
        </>
      )}
    </div>
  );
}
