"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount } from "@/lib/profile";
import { ApiError } from "@/lib/api-client";

export default function DeleteAccountPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await deleteAccount(password);
      await logout(); // cookies clear + redirect
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "অ্যাকাউন্ট মুছতে ব্যর্থ।",
      );
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-4">
      <div className="mb-8 border-b border-zinc-400/10 pb-4">
        <h1 className="text-2xl font-bold text-red-600">
          অ্যাকাউন্ট মুছে ফেলুন
        </h1>
        <p className="mt-2 text-sm">
          একবার আপনার অ্যাকাউন্ট মুছে ফেলা হলে, এর সমস্ত তথ্য এবং রিসোর্স
          স্থায়ীভাবে ডিলিট হয়ে যাবে।
        </p>
      </div>

      <div className="bg-red-600/10 p-4 rounded-lg border-l-4 border-red-500 mb-6">
        <h2 className="text-lg font-semibold text-red-600">
          আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্টটি মুছে ফেলতে চান?
        </h2>
        <p className="mt-1 text-sm text-red-600">
          নিরাপত্তার স্বার্থে আপনার পাসওয়ার্ডটি নিচে প্রদান করুন। এই কাজটি আর
          ফিরিয়ে আনা সম্ভব হবে না।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium mb-1">
            আপনার পাসওয়ার্ড দিন
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
          />
          {error && <div className="text-red-600 text-sm py-2">{error}</div>}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-red-600 opacity-90 hover:opacity-100 text-white rounded-xl text-sm font-medium disabled:opacity-60"
          >
            {loading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, অ্যাকাউন্ট মুছুন"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/settings/profile")}
            className="px-4 py-2 text-sm bg-zinc-400/10 hover:bg-zinc-400/25 rounded-xl"
          >
            বাতিল করুন
          </button>
        </div>
      </form>
    </section>
  );
}
