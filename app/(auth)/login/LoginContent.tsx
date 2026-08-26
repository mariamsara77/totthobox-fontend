"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, MailIcon } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import FacebookLoginButton from "@/components/auth/FacebookLoginButton";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";

type FieldErrors = { email?: string; password?: string; general?: string };

const inputClass =
  "w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 outline-none focus:bg-zinc-400/25 disabled:opacity-50";

const actionClass =
  "flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25 disabled:opacity-50";

export default function LoginContent() {
  const { login, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const redirectTo = "/";

  const [emailLogin, setEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user && !isAuthLoading) router.replace(redirectTo);
  }, [user, isAuthLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name as keyof FieldErrors]: undefined,
      general: undefined,
    }));
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
            setErrors({ general: data.message || "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" });
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
      <div className="space-y-2 text-center">
        <h1 className="text-2xl">আপনার অ্যাকাউন্টে লগ ইন করুন</h1>
        <p className="text-sm opacity-50">লগ ইন করতে নিচের ধাপগুলো অনুসরণ করুন</p>
      </div>

      {errors.general && (
        <div className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 text-center text-sm">
          {errors.general}
        </div>
      )}

      {emailLogin ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isLoading}
              placeholder="ইমেইল অ্যাড্রেস (email@example.com)"
              className={inputClass}
            />
            {errors.email && <p className="px-4 text-xs opacity-50">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={isLoading}
                placeholder="পাসওয়ার্ড দিন"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-4 flex items-center opacity-50 hover:opacity-100"
                tabIndex={-1}
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="px-4 text-xs opacity-50">{errors.password}</p>}
          </div>

          <div className="space-y-4">
            <button type="submit" disabled={isLoading} className={actionClass}>
              {isLoading ? "অপেক্ষা করুন..." : "লগ ইন করুন"}
            </button>

            <div className="flex items-center justify-between gap-4 px-2">
              <Link href="/forgot-password" className="text-xs opacity-50 hover:opacity-100">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
              <button
                type="button"
                onClick={() => {
                  setEmailLogin(false);
                  setErrors({});
                }}
                className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100"
              >
                <ArrowLeft size={14} /> পিছনে যান
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <button type="button" onClick={() => setEmailLogin(true)} className={actionClass}>
            <MailIcon size={18} /> ইমেইল দিয়ে লগ ইন
          </button>
          <GoogleLoginButton />
          <FacebookLoginButton />
        </div>
      )}

      <div className="flex items-center gap-4">
        <hr className="flex-1 border-zinc-400/25" />
        <span className="text-sm opacity-50">অথবা</span>
        <hr className="flex-1 border-zinc-400/25" />
      </div>

      <div className="text-center text-sm">
        <span>অ্যাকাউন্ট নেই? </span>
        <Link href="/register" className="font-bold opacity-50 hover:opacity-100">
          সাইন আপ করুন
        </Link>
      </div>
    </div>
  );
}
