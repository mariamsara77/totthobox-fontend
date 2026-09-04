"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle2, XCircle, KeyRound } from "lucide-react";
import clsx from "clsx";

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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isPasswordValid = password.length >= 8;
  const isConfirmValid =
    passwordConfirmation === password && passwordConfirmation.length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const nextErrors: FieldErrors = {};
    if (!password) nextErrors.password = "নতুন পাসওয়ার্ড দিতে হবে।";
    else if (!isPasswordValid)
      nextErrors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";

    if (!passwordConfirmation)
      nextErrors.password_confirmation = "পাসওয়ার্ড নিশ্চিত করুন।";
    else if (!isConfirmValid)
      nextErrors.password_confirmation = "পাসওয়ার্ড মিলছে না।";

    if (!token || !email)
      nextErrors.email = "রিসেট লিংকটি সঠিক নয় বা মেয়াদোত্তীর্ণ।";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 422) setErrors(validationErrors(data));
        else
          toast.error(
            responseMessage(data, "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।"),
          );
        return;
      }

      toast.success(
        responseMessage(data, "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!"),
      );
      setTimeout(() => window.location.replace("/"), 1200);
    } catch {
      toast.error("সার্ভারে সংযোগ করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 mb-1 mx-auto">
          <KeyRound size={24} />
        </div>
        <h1 className="text-2xl font-bold">নতুন পাসওয়ার্ড সেট করুন</h1>
        <p className="text-sm opacity-50">
          আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড দিন
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)"
            autoComplete="new-password"
            className={clsx(
              "w-full rounded-xl border bg-zinc-400/10 px-4 py-3.5 pr-20 outline-none transition focus:ring-2 focus:ring-emerald-600",
              errors.password ? "border-rose-500" : "border-transparent",
            )}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {password && isPasswordValid && !errors.password ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : null}
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-zinc-400 hover:text-zinc-600"
              aria-label={
                showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-red-500 text-xs mt-1.5 pl-4">
              {errors.password}
            </p>
          ) : null}
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
              "w-full rounded-xl border bg-zinc-400/10 px-4 py-3.5 pr-20 outline-none transition focus:ring-2 focus:ring-emerald-600",
              errors.password_confirmation
                ? "border-red-500"
                : "border-transparent",
            )}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {passwordConfirmation ? (
              isConfirmValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )
            ) : null}
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              className="text-zinc-400 hover:text-zinc-600"
              aria-label={showConfirm ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password_confirmation ? (
            <p className="text-red-500 text-xs mt-1.5 pl-4">
              {errors.password_confirmation}
            </p>
          ) : null}
        </div>

        {errors.email ? (
          <p className="text-red-500 text-xs text-center">{errors.email}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition disabled:opacity-60"
        >
          {loading ? "পরিবর্তন করা হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
        </button>
      </form>

      <p className="text-center text-sm opacity-50 mt-8">
        পাসওয়ার্ড মনে আছে?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          লগ ইন করুন
        </Link>
      </p>
    </div>
  );
}

function ResetPasswordFallback() {
  return <div className="text-center py-10 opacity-50">লোড হচ্ছে...</div>;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
