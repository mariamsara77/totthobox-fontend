"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import clsx from "clsx";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/forgot-password", {
        email,
      });

      toast.success(res.data.message);
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const message =
          err.response.data.errors?.email?.[0] ||
          err.response.data.message ||
          "কিছু একটা ভুল হয়েছে";
        setError(message);
      } else {
        toast.error(err.response?.data?.message || "কিছু একটা ভুল হয়েছে");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            পাসওয়ার্ড ভুলে গেছেন?
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            আপনার ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাবো
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                ইমেইল পাঠানো হয়েছে!
              </h2>
              <p className="text-sm text-zinc-500 mt-2">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {email}
                </span>{" "}
                এ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইনবক্স চেক করুন।
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
            >
              <ArrowLeft size={16} />
              লগইন পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল ঠিকানা"
                required
                autoFocus
                className={clsx(
                  "w-full rounded-full py-3.5 px-6 border bg-zinc-400/10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition",
                  error
                    ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                    : "border-transparent"
                )}
              />
              {error && (
                <p className="text-red-600 text-xs mt-1.5 pl-4">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition disabled:opacity-60"
            >
              {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
            </button>

            <div className="text-center text-sm text-zinc-500">
              <span>অথবা, </span>
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                লগইন পেজে ফিরে যান
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}