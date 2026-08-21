"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, MailIcon } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import FacebookLoginButton from "@/components/auth/FacebookLoginButton";

export default function LoginPage() {
  const router = useRouter();

  // States
  const [emailLogin, setEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // টাইপ করার সাথে সাথে এরর মুছে ফেলা
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setStatus(null);

    try {
      // আপনার .env সেটআপ অনুযায়ী Base URL
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Laravel-কে বোঝানোর জন্য যে এটি API রিকোয়েস্ট
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Laravel এর ভ্যালিডেশন এরর হ্যান্ডলিং
        if (data.errors) {
          // Laravel ভ্যালিডেশন এরর সাধারণত Array আকারে আসে (যেমন data.errors.email[0])
          setErrors({
            email: data.errors.email ? data.errors.email[0] : undefined,
            password: data.errors.password
              ? data.errors.password[0]
              : undefined,
          });
        } else {
          setErrors({
            email: data.message || "লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।",
          });
        }
      } else {
        // Success
        setStatus("লগইন সফল হয়েছে! রিডাইরেক্ট করা হচ্ছে...");
        // টোকেনটি লোকালস্টোরেজে সেভ করা হলো
        localStorage.setItem("auth_token", data.token);

        setTimeout(() => {
          router.push("/");
          router.refresh(); // Navbar আপডেট করার জন্য রিফ্রেশ
        }, 1000);
      }
    } catch (error) {
      // এই লাইনটি যুক্ত করুন, এটি আমাদের আসল সমস্যা ধরিয়ে দেবে
      console.error("API Error Details:", error);

      setErrors({ email: "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            আপনার অ্যাকাউন্টে লগ ইন করুন
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            লগ ইন করতে নিচের ধাপগুলো অনুসরণ করুন
          </p>
        </div>

        {status && (
          <div className="p-3 text-center text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
            {status}
          </div>
        )}

        {emailLogin ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Input */}
            <div className="space-y-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                placeholder="ইমেইল অ্যাড্রেস (email@example.com)"
                className={`w-full rounded-full py-4 px-6 text-slate-900 dark:text-white transition-all duration-200 outline-none border focus:ring-2 focus:ring-black dark:focus:ring-white ${
                  errors.email
                    ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs pl-4 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="পাসওয়ার্ড দিন"
                  className={`w-full rounded-full py-4 px-6 text-slate-900 dark:text-white transition-all duration-200 outline-none border focus:ring-2 focus:ring-black dark:focus:ring-white ${
                    errors.password
                      ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs pl-4 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-4 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full p-4 font-bold bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black transition disabled:opacity-70"
              >
                {isLoading ? "অপেক্ষা করুন..." : "লগ ইন করুন"}
              </button>

              <div className="flex justify-between items-center px-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 hover:text-emerald-600 transition"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
                <button
                  type="button"
                  onClick={() => setEmailLogin(false)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition"
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
              className="w-full flex items-center justify-center gap-3 rounded-full p-4 font-semibold bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black transition"
            >
              <MailIcon size={18} /> ইমেইল দিয়ে লগ ইন
            </button>

            {/* Social Logins */}
            <GoogleLoginButton />
            <FacebookLoginButton />
          </div>
        )}

        <div className="flex items-center justify-center">
          <hr className="grow border-zinc-400/25" />
          <span className="mx-4 text-sm text-zinc-600 dark:text-zinc-400">
            অথবা
          </span>
          <hr className="grow border-zinc-400/25" />
        </div>

        <div className="text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            অ্যাকাউন্ট নেই?{" "}
          </span>
          <Link
            href="/register"
            className="font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            সাইন আপ করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
