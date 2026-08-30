"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, X, UserRound } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getSavedProfiles,
  removeSavedProfile,
  type SavedProfile,
} from "@/lib/saved-profiles";

type ViewState =
  | { mode: "list" } // saved profiles দেখাচ্ছি
  | { mode: "switching"; profile: SavedProfile } // one-click চলছে
  | { mode: "password"; profile: SavedProfile } // refresh expired → password চাই
  | { mode: "manual" }; // সাধারণ email/password form

export default function LoginContent() {
  const { login, loginWithRefresh, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<ViewState>({ mode: "list" });
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);

  // manual form
  const [showPass, setShowPass] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // password fallback form (refresh expired)
  const [fallbackPass, setFallbackPass] = useState("");
  const [showFallbackPass, setShowFallbackPass] = useState(false);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState("");
  const fallbackRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSavedProfiles(getSavedProfiles());
  }, []);

  useEffect(() => {
    if (user && !authLoading) router.push("/");
  }, [user, authLoading, router]);

  // password fallback açıldığında focus
  useEffect(() => {
    if (view.mode === "password") {
      setFallbackPass("");
      setFallbackError("");
      requestAnimationFrame(() => fallbackRef.current?.focus());
    }
  }, [view]);

  // ── Saved profile click → one-click refresh ──────────────────────────
  const handlePickProfile = async (profile: SavedProfile) => {
    setView({ mode: "switching", profile });

    const ok = await loginWithRefresh();

    if (ok) {
      // applyUser সফল — AuthContext redirect করবে
      return;
    }

    // Refresh token নেই বা expire — password চাই
    setView({ mode: "password", profile });
  };

  // ── Fallback: password দিয়ে login (refresh expired) ──────────────────
  const handleFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view.mode !== "password") return;

    if (!fallbackPass.trim()) {
      setFallbackError("পাসওয়ার্ড দিতে হবে।");
      return;
    }

    setFallbackLoading(true);
    setFallbackError("");

    try {
      await login(view.profile.email, fallbackPass);
      // সফল → AuthContext-এর useEffect redirect করবে
    } catch (err: any) {
      setFallbackError(
        err?.errors?.password?.[0] || err?.message || "পাসওয়ার্ড সঠিক নয়।",
      );
    } finally {
      setFallbackLoading(false);
    }
  };

  // ── Manual email/password form ────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.email.trim()) next.email = "ইমেইল দিতে হবে।";
    if (!form.password) next.password = "পাসওয়ার্ড দিতে হবে।";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setFormLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err: any) {
      if (err?.errors) {
        setErrors({
          email: err.errors.email?.[0],
          password: err.errors.password?.[0],
        });
      } else {
        setErrors({ general: err?.message || "লগইন করতে সমস্যা হয়েছে।" });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveProfile = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    removeSavedProfile(email);
    setSavedProfiles((p) => p.filter((x) => x.email !== email));
    if (view.mode === "password" && view.profile.email === email) {
      setView({ mode: "list" });
    }
  };

  if (authLoading) return null;

  // ═══════════════════════════════════════════════════════════════════════
  // ── Switching overlay ─────────────────────────────────────────────────
  if (view.mode === "switching") {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center gap-6 py-12">
        <div className="relative">
          {view.profile.avatar_url ? (
            <img
              src={view.profile.avatar_url}
              alt={view.profile.name}
              referrerPolicy="no-referrer"
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <span className="h-20 w-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <UserRound size={32} className="text-zinc-400" />
            </span>
          )}
          {/* spinner ring */}
          <span className="absolute -inset-1 rounded-3xl border-2 border-zinc-300 dark:border-zinc-600 animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-base">{view.profile.name}</p>
          <p className="text-sm text-zinc-500">{view.profile.email}</p>
        </div>
        <p className="text-sm text-zinc-500">লগইন হচ্ছে…</p>
      </div>
    );
  }

  // ── Password fallback (refresh expired) ───────────────────────────────
  if (view.mode === "password") {
    return (
      <div className="max-w-md mx-auto space-y-6">
        {/* Profile card */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          {view.profile.avatar_url ? (
            <img
              src={view.profile.avatar_url}
              alt={view.profile.name}
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-xl object-cover shrink-0"
            />
          ) : (
            <span className="h-11 w-11 rounded-xl bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center shrink-0">
              <UserRound size={20} />
            </span>
          )}
          <div className="min-w-0 grow">
            <p className="font-semibold text-sm truncate">
              {view.profile.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {view.profile.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView({ mode: "list" })}
            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 shrink-0 transition"
          >
            পরিবর্তন
          </button>
        </div>

        <p className="text-sm text-center text-zinc-500">
          সেশন শেষ হয়ে গেছে। পাসওয়ার্ড দিয়ে লগইন করুন।
        </p>

        {fallbackError && (
          <p className="text-sm text-center text-red-500">{fallbackError}</p>
        )}

        <form
          onSubmit={handleFallbackSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="relative">
            <input
              ref={fallbackRef}
              type={showFallbackPass ? "text" : "password"}
              value={fallbackPass}
              onChange={(e) => {
                setFallbackPass(e.target.value);
                setFallbackError("");
              }}
              placeholder="পাসওয়ার্ড"
              className="w-full rounded-full py-4 pl-6 pr-12 bg-zinc-400/10 outline-none border border-transparent focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowFallbackPass((v) => !v)}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              {showFallbackPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end px-2">
            <Link
              href="/forgot-password"
              className="text-xs opacity-60 hover:opacity-100 transition"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <button
            type="submit"
            disabled={fallbackLoading}
            className="w-full rounded-full p-4 font-bold text-white bg-black dark:text-black dark:bg-white disabled:opacity-60 transition"
          >
            {fallbackLoading ? "অপেক্ষা করুন…" : "লগইন করুন"}
          </button>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ── Main: saved profiles + manual form ───────────────────────────────
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">লগ ইন করুন</h1>
      </div>

      {/* ── Saved profiles ─────────────────────────────────────────────── */}
      {savedProfiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 px-1">আগের অ্যাকাউন্ট</p>
          <div className="flex flex-col gap-2">
            {savedProfiles.map((profile) => (
              <button
                key={profile.email}
                type="button"
                onClick={() => handlePickProfile(profile)}
                className="group flex items-center gap-3 w-full p-3 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/20 transition text-left"
              >
                {/* Avatar */}
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <span className="h-10 w-10 rounded-xl bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                    <UserRound size={18} className="text-zinc-500" />
                  </span>
                )}

                {/* Name + email */}
                <div className="min-w-0 grow">
                  <p className="text-sm font-semibold truncate">
                    {profile.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {profile.email}
                  </p>
                </div>

                {/* Remove */}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="সরান"
                  onClick={(e) => handleRemoveProfile(e, profile.email)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleRemoveProfile(e as any, profile.email)
                  }
                  className="opacity-0 group-hover:opacity-100 transition text-zinc-400 hover:text-red-500 shrink-0 p-1"
                >
                  <X size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Divider ────────────────────────────────────────────────────── */}
      {savedProfiles.length > 0 && (
        <div className="flex items-center gap-4">
          <hr className="grow border-zinc-400/25" />
          <span className="text-xs text-zinc-400">
            অন্য অ্যাকাউন্টে লগইন করুন
          </span>
          <hr className="grow border-zinc-400/25" />
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {errors.general && (
        <div className="p-3 text-sm text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
          {errors.general}
        </div>
      )}

      {/* ── Manual form ────────────────────────────────────────────────── */}
      <form
        onSubmit={handleManualSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ইমেইল অ্যাড্রেস"
            className={`w-full rounded-full py-4 px-6 bg-zinc-400/10 outline-none border ${
              errors.email
                ? "border-red-500"
                : "border-transparent focus:border-zinc-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="পাসওয়ার্ড"
              className={`w-full rounded-full py-4 pl-6 pr-12 bg-zinc-400/10 outline-none border ${
                errors.password
                  ? "border-red-500"
                  : "border-transparent focus:border-zinc-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-4">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end px-2">
          <Link
            href="/forgot-password"
            className="text-xs opacity-60 hover:opacity-100 transition"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

        <button
          type="submit"
          disabled={formLoading}
          className="w-full rounded-full p-4 font-bold text-white bg-black dark:text-black dark:bg-white disabled:opacity-60 transition"
        >
          {formLoading ? "অপেক্ষা করুন…" : "লগ ইন করুন"}
        </button>
      </form>

      <div className="flex items-center justify-center gap-4">
        <hr className="grow border-zinc-400/25" />
        <span className="text-sm opacity-50">অথবা</span>
        <hr className="grow border-zinc-400/25" />
      </div>

      <GoogleLoginButton />

      <div className="text-center text-sm">
        <span>অ্যাকাউন্ট নেই? </span>
        <Link
          href="/register"
          className="font-bold text-blue-600 hover:opacity-80 transition"
        >
          সাইন আপ করুন
        </Link>
      </div>
    </div>
  );
}
