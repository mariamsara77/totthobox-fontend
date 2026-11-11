"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RxSwitch } from "react-icons/rx";

export default function CookieSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    analytics: false,
    marketing: false,
  });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (!saved) {
      setSettings({ analytics: false, marketing: false });
      setShowBanner(true);
      return;
    }

    try {
      const data = JSON.parse(saved);
      setSettings({
        analytics: data.analytics === true,
        marketing: data.marketing === true,
      });
      setShowBanner(false);
    } catch {
      setSettings({ analytics: false, marketing: false });
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const save = (all = false, necessaryOnly = false) => {
    const prefs = {
      necessary: true,
      analytics: necessaryOnly ? false : all ? true : settings.analytics,
      marketing: necessaryOnly ? false : all ? true : settings.marketing,
      timestamp: Date.now(),
      version: 1,
    };
    localStorage.setItem("cookie_consent", JSON.stringify(prefs));
    setSettings({ analytics: prefs.analytics, marketing: prefs.marketing });
    setIsOpen(false);
    setShowBanner(false);
    window.dispatchEvent(
      new CustomEvent("totthobox:consent-updated", {
        detail: { analytics: prefs.analytics, marketing: prefs.marketing },
      }),
    );
  };

  return (
    <>
      {showBanner && (
        <section
          role="region"
          aria-label="কুকি সম্মতি"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:inset-x-6 sm:p-5"
        >
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            আপনার কুকি পছন্দ
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            প্রয়োজনীয় স্টোরেজ সাইট চালাতে ব্যবহৃত হয়। অ্যানালিটিক্স ও মার্কেটিং
            প্রযুক্তি ঐচ্ছিক; আপনার সিদ্ধান্ত না পাওয়া পর্যন্ত এগুলো চালু হবে না।
            বিস্তারিত জানতে কুকি নীতি পড়ুন।
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => save(false, true)}
              className="min-h-11 rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              শুধু প্রয়োজনীয়
            </button>
            <button
              type="button"
              onClick={() => { setIsOpen(true); setShowBanner(false); }}
              className="min-h-11 rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              পছন্দ ঠিক করুন
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              className="min-h-11 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
            >
              সব গ্রহণ
            </button>
          </div>
        </section>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-xs transition hover:border-zinc-400 hover:text-zinc-900 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
      >
        <RxSwitch className="h-3.5 w-3.5 opacity-70" />
        কুকি সেটিংস
      </button>

      {/* Bottom-right panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50">
          <div
            className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/50 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="w-[calc(100vw-2rem)] sm:w-96 max-w-sm overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <h3
                id="cookie-title"
                className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                কুকি ও গোপনীয়তা সেটিংস
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
                aria-label="বন্ধ করুন"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] items-center justify-between rounded-xl px-4 py-2.5 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100/70 dark:bg-zinc-800/60 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 transition"
            >
              <span>বিস্তারিত সেটিংস</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Options */}
            {isExpanded && (
              <div className="mx-3 mt-2 space-y-0 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 px-4 py-1">
                {/* Necessary */}
                <div className="flex items-center justify-between py-2.5 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      প্রয়োজনীয় কুকিজ
                    </p>
                    <p className="text-[10px] text-zinc-500">সাইট পরিচালনার জন্য আবশ্যিক</p>
                  </div>
                  <span className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                    সর্বদা সক্রিয়
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between py-2.5 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      অ্যানালিটিক্স
                    </p>
                    <p className="text-[10px] text-zinc-500">ভিজিটর পরিসংখ্যান ও উন্নয়ন</p>
                  </div>
                  <button
                    type="button"
                    aria-label="অ্যানালিটিক্স"
                    aria-pressed={settings.analytics}
                    onClick={() =>
                      setSettings((s) => ({ ...s, analytics: !s.analytics }))
                    }
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                      settings.analytics
                        ? "bg-emerald-600"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        settings.analytics ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      মার্কেটিং ও বিজ্ঞাপন
                    </p>
                    <p className="text-[10px] text-zinc-500">গুগল অ্যাডসেন্স ও প্রাসঙ্গিক বিজ্ঞাপন</p>
                  </div>
                  <button
                    type="button"
                    aria-label="মার্কেটিং"
                    aria-pressed={settings.marketing}
                    onClick={() =>
                      setSettings((s) => ({ ...s, marketing: !s.marketing }))
                    }
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                      settings.marketing
                        ? "bg-emerald-600"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        settings.marketing ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-4">
              <p className="mb-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                বিস্তারিত জানতে আমাদের{" "}
                <Link
                  href="/cookie-policy"
                  className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 transition"
                >
                  কুকি নীতি
                </Link>{" "}
                পড়ুন।
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => save(false, true)}
                  className="flex-1 rounded-xl py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  শুধু প্রয়োজনীয়
                </button>
                <button
                  type="button"
                  onClick={() => save()}
                  className="flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  সংরক্ষণ
                </button>
                <button
                  type="button"
                  onClick={() => save(true)}
                  className="rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:opacity-90 transition"
                >
                  সব গ্রহণ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
