"use client";

import { useState } from "react";
import { updatePassword } from "@/lib/profile";
import { ApiError } from "@/lib/api-client";

export default function PasswordSettingsPage() {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePassword(form);
      setForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "পাসওয়ার্ড আপডেট ব্যর্থ।",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">পাসওয়ার্ড আপডেট</h1>
      <p className="text-sm text-zinc-500 mb-6">
        নিরাপত্তার জন্য একটি লম্বা ও র‍্যান্ডম পাসওয়ার্ড ব্যবহার করুন।
      </p>

      {error && <div className="p-4 text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="p-4 text-green-600 text-sm">
          পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            বর্তমান পাসওয়ার্ড
          </label>
          <input
            type="password"
            value={form.current_password}
            onChange={(e) =>
              setForm({ ...form, current_password: e.target.value })
            }
            className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            নতুন পাসওয়ার্ড
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <input
            type="password"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            className="w-full rounded-xl px-4 py-2.5 outline-none bg-zinc-400/10 focus:ring-2"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 bg-zinc-400/10 hover:bg-zinc-400/25 rounded-xl text-sm font-medium disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </form>
    </section>
  );
}
