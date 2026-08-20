"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, CheckCircle2, XCircle, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import FacebookLoginButton from "@/components/auth/FacebookLoginButton";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [otp, setOtp] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time validation helpers
  const isNameValid = name.length >= 3 && name.length <= 50;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isConfirmValid = passwordConfirmation === password && passwordConfirmation.length > 0;

  const getEmailDashboardUrl = () => {
    const domain = email.split("@")[1]?.toLowerCase();
    switch (domain) {
      case "gmail.com":
        return "https://mail.google.com/";
      case "yahoo.com":
        return "https://mail.yahoo.com/";
      case "outlook.com":
      case "hotmail.com":
      case "live.com":
        return "https://outlook.live.com/";
      case "icloud.com":
        return "https://www.icloud.com/mail";
      default:
        return `mailto:${email}`;
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
    const res = await api.post("/api/auth/register/send-otp", {
  name,
  email,
  password,
  password_confirmation: passwordConfirmation,
});

      toast.success(res.data.message);
      setStep("otp");
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        const mapped: Record<string, string> = {};
        Object.keys(validationErrors).forEach((key) => {
          mapped[key] = validationErrors[key][0];
        });
        setErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || "কিছু একটা ভুল হয়েছে");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await api.post("/api/auth/register/verify", {
  email,
  otp,
});

      // Token save
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Multi-account cookie logic (optional)
      const cookieName = "saved_accounts";
      let userIds: number[] = [];
      try {
        const existing = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${cookieName}=`))
          ?.split("=")[1];
        if (existing) {
          userIds = JSON.parse(decodeURIComponent(existing)) || [];
        }
      } catch {}

      if (!userIds.includes(res.data.user.id)) {
        userIds.push(res.data.user.id);
      }

      document.cookie = `${cookieName}=${encodeURIComponent(
        JSON.stringify(userIds)
      )}; path=/; max-age=${60 * 60 * 24 * 365 * 5}`; // 5 years

      toast.success(res.data.message);
      router.push("/"); // home page
    } catch (err: any) {
  console.error("API Error:", err.response?.data || err.message); // কনসোলে দেখবে

  if (err.response?.status === 422) {
    const validationErrors = err.response.data.errors || {};
    const mapped: Record<string, string> = {};
    Object.keys(validationErrors).forEach((key) => {
      mapped[key] = validationErrors[key][0];
    });
    setErrors(mapped);
  } else {
    const message = err.response?.data?.message || err.message || "কিছু একটা ভুল হয়েছে";
    toast.error(message);
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md">
        <div className="">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {step === "form" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "ইমেইল ভেরিফাই করুন"}
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              {step === "form"
                ? "আপনার তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন"
                : "আপনার ইমেইলে পাঠানো ৪ ডিজিটের কোডটি দিন"}
            </p>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম"
                  className={clsx(
                    "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                    errors.name
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-transparent"
                  )}
                />
                {name && isNameValid && !errors.name && (
                  <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1.5 pl-4">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ইমেইল (যেমন: name@example.com)"
                  className={clsx(
                    "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                    errors.email
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-transparent"
                  )}
                />
                {email && isEmailValid && !errors.email && (
                  <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1.5 pl-4">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  className={clsx(
                    "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition pr-20",
                    errors.password
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-transparent"
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  {password && isPasswordValid && !errors.password && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1.5 pl-4">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
                  className={clsx(
                    "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition pr-20",
                    errors.password_confirmation
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-transparent"
                  )}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  {passwordConfirmation && (
                    isConfirmValid ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-red-600 text-xs mt-1.5 pl-4">
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
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Email info */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                  <Mail size={16} />
                  <span>আমরা কোডটি পাঠিয়েছি:</span>
                </div>
                <a
                  href={getEmailDashboardUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
                >
                  {email}
                  <ExternalLink size={14} className="opacity-60" />
                </a>
                <p className="text-xs text-zinc-400 italic">
                  ইনবক্স না পেলে স্প্যাম ফোল্ডার চেক করুন।
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
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

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setErrors({});
                }}
                className="w-full text-center text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              >
                ভুল ইমেইল? তথ্য পরিবর্তন করুন
              </button>
            </form>
          )}

          {step === "form" && (
            <>
             <div className="my-8 flex items-center justify-center">
  <hr className="grow border-zinc-400/25" />
  <span className="mx-4 text-sm text-zinc-600 dark:text-zinc-400">অথবা</span>
  <hr className="grow border-zinc-400/25" />
</div>

              {/* Social Login Placeholders */}
              <div className="space-y-3">
                  {/* Social Logins */}
                         <GoogleLoginButton />
                         <FacebookLoginButton />
              </div>

              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-8">
                অ্যাকাউন্ট আছে?{" "}
                <Link href="/login" className="font-bold text-blue-600 hover:underline">
                  লগ ইন করুন
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}