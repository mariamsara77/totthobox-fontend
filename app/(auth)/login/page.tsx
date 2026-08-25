"use client";

export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, MailIcon } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import FacebookLoginButton from "@/components/auth/FacebookLoginButton";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";

type FieldErrors = { email?: string; password?: string; general?: string };

// ১. মূল UI এবং Form Logic আলাদা ফাংশনে রাখুন
function LoginContent() {
  const { login, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const redirectTo = "/";

  const [emailLogin, setEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user && !isAuthLoading) {
      router.replace(redirectTo);
    }
  }, [user, isAuthLoading, router, redirectTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name as keyof FieldErrors]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof ApiError) {
        const data = (err.data ?? {}) as {
          message?: string;
          errors?: { email?: string[]; password?: string[] };
        };

        switch (err.status) {
          case 422:
            setErrors({
              email: data.errors?.email?.[0],
              password: data.errors?.password?.[0],
              general: !data.errors ? data.message : undefined,
            });
            break;
          case 401:
            setErrors({ general: data.message || "ইমেইল বা পাসওয়ার্ড ভুল।" });
            break;
          case 429:
            setErrors({
              general: data.message || "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
            });
            break;
          case 503:
            setErrors({ general: "সার্ভার সাময়িকভাবে অনুপলব্ধ। পরে আবার চেষ্টা করুন।" });
            break;
          default:
            setErrors({ general: data.message || "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
        }
      } else {
        setErrors({ general: "অপ্রত্যাশিত সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) return null;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">আপনার অ্যাকাউন্টে লগ ইন করুন</h1>
        <p className="text-sm text-zinc-500">লগ ইন করতে নিচের ধাপগুলো অনুসরণ করুন</p>
      </div>

      {/* General error banner */}
      {errors.general && (
        <div className="p-4 text-center text-sm rounded-xl border border-red-400/30 bg-red-500/10 text-red-500">
          {errors.general}
        </div>
      )}

      {emailLogin ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Email */}
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isLoading}
              placeholder="ইমেইল অ্যাড্রেস (email@example.com)"
              className={`w-full rounded-full py-4 px-6 bg-zinc-400/10 outline-none transition-all duration-200 disabled:opacity-60 ${
                errors.email ? "border-2 border-red-500" : "border-2 border-transparent"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs pl-4">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={isLoading}
                placeholder="পাসওয়ার্ড দিন"
                className={`w-full rounded-full py-4 pl-6 pr-12 bg-zinc-400/10 outline-none transition-all duration-200 disabled:opacity-60 ${
                  errors.password ? "border-2 border-red-500" : "border-2 border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600 transition"
                tabIndex={-1}
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs pl-4">{errors.password}</p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full p-4 font-bold text-white dark:text-black bg-black dark:bg-white hover:opacity-80 transition disabled:opacity-60"
            >
              {isLoading ? "অপেক্ষা করুন..." : "লগ ইন করুন"}
            </button>

            <div className="flex justify-between items-center px-2">
              <Link
                href="/forgot-password"
                className="text-xs text-zinc-400 hover:text-zinc-300 transition"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
              <button
                type="button"
                onClick={() => {
                  setEmailLogin(false);
                  setErrors({});
                }}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300 transition"
              >
                <ArrowLeft size={14} /> পিছনে যান
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setEmailLogin(true)}
            className="w-full flex items-center justify-center gap-4 rounded-full p-4 font-medium text-white dark:text-black bg-black dark:bg-white hover:opacity-90 transition"
          >
            <MailIcon size={18} /> ইমেইল দিয়ে লগ ইন
          </button>

          <GoogleLoginButton />
          <FacebookLoginButton />
        </div>
      )}

      <div className="flex items-center justify-center">
        <hr className="grow border-zinc-400/25" />
        <span className="mx-4 text-sm text-zinc-500">অথবা</span>
        <hr className="grow border-zinc-400/25" />
      </div>

      <div className="text-center text-sm">
        <span>অ্যাকাউন্ট নেই? </span>
        <Link href="/register" className="font-bold text-blue-600 hover:opacity-60 transition">
          সাইন আপ করুন
        </Link>
      </div>
    </div>
  );
}

// ২. Default Export-এ Suspense দিয়ে Wrap করে দিন
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">লোডিং...</div>}>
      <LoginContent />
    </Suspense>
  );
}