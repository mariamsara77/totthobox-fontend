"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RxSwitch } from "react-icons/rx";

export default function CookieSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (!saved) {
      setIsOpen(true);
      return;
    }

    try {
      const data = JSON.parse(saved);
      setSettings({
        analytics: data.analytics === true,
        marketing: data.marketing === true,
      });
    } catch {
      setSettings({ analytics: false, marketing: false });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        triggerRef.current?.focus();
      }
      return;
    }

    wasOpenRef.current = true;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: prefs }));
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        className="flex min-h-11 items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-900/90 px-3 py-2 text-[11px] font-medium text-zinc-300 backdrop-blur transition hover:border-zinc-600 hover:text-zinc-100"
      >
        <RxSwitch className="h-3.5 w-3.5 opacity-70" />
        কুকি
      </button>

      {/* Bottom-right panel */}
      {isOpen && (
        <div className="fixed bottom-8 right-5 z-50">
          <div className="fixed inset-0 -z-10 bg-black/20" aria-hidden="true" />

          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-description"
            className="w-[min(calc(100vw-2rem),24rem)] max-h-[85dvh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-2">
              <h3
                id="cookie-title"
                className="text-[14px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                কুকি সেটিংস
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
            <p id="cookie-description" className="px-5 pb-2 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
              অ্যানালিটিক্স ও বিজ্ঞাপন কুকিজ ঐচ্ছিক। আপনার পছন্দ সংরক্ষণ না করা পর্যন্ত এগুলো চালু হবে না।
            </p>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mx-3 flex w-[calc(100%-24px)] items-center justify-between rounded-full px-4 py-2.5 text-left text-[12px] font-medium hover:bg-zinc-400/25 backdrop-blur-lg"
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
              <div className="mx-3 mb-2 space-y-0 rounded-4xl bg-zinc-400/10 px-4 py-1">
                {/* Necessary */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200">
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
                  <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200">
                    অ্যানালিটিক্স
                  </p>
                  <button
                    type="button"
                    aria-label="অ্যানালিটিক্স"
                    aria-pressed={settings.analytics}
                    onClick={() =>
                      setSettings((s) => ({ ...s, analytics: !s.analytics }))
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                      settings.analytics ? "bg-zinc-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        settings.analytics ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between py-3">
                  <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200">
                    মার্কেটিং
                  </p>
                  <button
                    type="button"
                    aria-label="মার্কেটিং"
                    aria-pressed={settings.marketing}
                    onClick={() =>
                      setSettings((s) => ({ ...s, marketing: !s.marketing }))
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                      settings.marketing ? "bg-zinc-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        settings.marketing ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 pb-4 pt-1">
              <p className="mb-3 text-[10px] text-zinc-600 dark:text-zinc-400">
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
                  className="min-h-11 flex-1 rounded-full px-2 py-2 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  শুধু প্রয়োজনীয়
                </button>
                <button
                  type="button"
                  onClick={() => save()}
                  className="min-h-11 flex-1 rounded-full bg-zinc-800 px-2 py-2 text-[11px] font-medium text-zinc-100 transition hover:bg-zinc-700"
                >
                  সংরক্ষণ
                </button>
                <button
                  type="button"
                  onClick={() => save(true)}
                  className="min-h-11 rounded-full bg-zinc-100 px-4 py-2 text-[11px] font-medium text-zinc-900 transition hover:bg-white"
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
