"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RxSwitch } from "react-icons/rx";

export default function CookieSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      setSettings({
        analytics: data.analytics ?? true,
        marketing: data.marketing ?? true,
      });
    } catch {
      if (saved === "necessary") {
        setSettings({ analytics: false, marketing: false });
      }
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
    };
    localStorage.setItem("cookie_consent", JSON.stringify(prefs));
    setSettings({ analytics: prefs.analytics, marketing: prefs.marketing });
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-[var(--brand-surface)] px-3 py-1.5 text-[11px] font-bold text-[var(--brand-primary-strong)] ring-1 ring-[var(--brand-border)] transition hover:bg-[var(--brand-primary)] hover:text-white"
      >
        <RxSwitch className="h-3.5 w-3.5 opacity-70" />
        কুকি
      </button>

      {/* Bottom-right panel */}
      {isOpen && (
        <div className="fixed bottom-8 right-5 z-50">
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="surface-panel w-[min(92vw,25rem)] overflow-hidden rounded-[1.5rem] p-1.5 shadow-[0_28px_80px_rgb(6_32_28_/_0.24)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h3
                id="cookie-title"
                className="text-[14px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                কুকি সেটিংস
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)]"
                aria-label="বন্ধ করুন"
              >
                <svg
                  className="h-3.5 w-3.5"
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
              className="mx-1.5 flex w-[calc(100%-12px)] items-center justify-between rounded-xl bg-[var(--brand-surface)] px-4 py-2.5 text-left text-[12px] font-semibold backdrop-blur-lg"
            >
              <span>বিস্তারিত সেটিংস</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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

            {/* Options - collapsed by default */}
            {isExpanded && (
              <div className="mx-1.5 mb-2 space-y-0 rounded-2xl bg-[var(--brand-surface)] px-4 py-1">
                {/* Necessary */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                      প্রয়োজনীয়
                    </p>
                    <p className="text-[10px] text-zinc-500">সর্বদা চালু</p>
                  </div>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400">
                    On
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between py-3">
                  <p className="text-[13px] font-medium text-zinc-200">
                    অ্যানালিটিক্স
                  </p>
                  <button
                    type="button"
                    aria-label="অ্যানালিটিক্স"
                    aria-pressed={settings.analytics}
                    onClick={() =>
                      setSettings((s) => ({ ...s, analytics: !s.analytics }))
                    }
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                      settings.analytics ? "bg-[var(--brand-primary)]" : "bg-zinc-300 dark:bg-zinc-800"
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
                <div className="flex items-center justify-between py-3">
                  <p className="text-[13px] font-medium text-zinc-200">
                    মার্কেটিং
                  </p>
                  <button
                    type="button"
                    aria-label="মার্কেটিং"
                    aria-pressed={settings.marketing}
                    onClick={() =>
                      setSettings((s) => ({ ...s, marketing: !s.marketing }))
                    }
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                      settings.marketing ? "bg-[var(--brand-secondary)]" : "bg-zinc-300 dark:bg-zinc-800"
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
            <div className="px-5 pb-4 pt-1">
              <p className="mb-3 text-[10px] text-zinc-500">
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-2 transition hover:text-zinc-300"
                >
                  গোপনীয়তা নীতি
                </Link>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => save(false, true)}
                  className="flex-1 rounded-full py-2 text-[11px] font-medium text-zinc-400 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)]"
                >
                  শুধু প্রয়োজনীয়
                </button>
                <button
                  type="button"
                  onClick={() => save()}
                  className="flex-1 rounded-xl bg-[var(--brand-primary)] py-2 text-[11px] font-bold text-white transition hover:bg-[var(--brand-primary-strong)]"
                >
                  সংরক্ষণ
                </button>
                <button
                  type="button"
                  onClick={() => save(true)}
                  className="rounded-xl bg-[var(--brand-highlight)] px-4 py-2 text-[11px] font-bold text-[#24302d] transition hover:brightness-95"
                >
                  সব
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
