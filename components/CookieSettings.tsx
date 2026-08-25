"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RxSwitch } from "react-icons/rx";

export default function CookieSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("cookie_consent");
      if (!saved) return;

      try {
        const data = JSON.parse(saved);
        setCookieSettings({
          analytics: data.analytics ?? true,
          marketing: data.marketing ?? true,
        });
      } catch {
        if (saved === "necessary") {
          setCookieSettings({ analytics: false, marketing: false });
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const saveConsent = (all = false, necessaryOnly = false) => {
    const preferences = {
      necessary: true,
      analytics: necessaryOnly ? false : all ? true : cookieSettings.analytics,
      marketing: necessaryOnly ? false : all ? true : cookieSettings.marketing,
      timestamp: Date.now(),
    };

    localStorage.setItem("cookie_consent", JSON.stringify(preferences));
    setCookieSettings({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-50 hover:bg-zinc-700"
      >
        <RxSwitch className="w-4 h-4" /> কুকি সেটিংস
      </button>

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          className="fixed inset-0 z-50 mt-20 ml-35 flex items-center justify-center duration-200"
        >
          <div className="rounded-xl border border-zinc-400/25 bg-zinc-950 p-4 duration-200">
            <div className="mb-3">
              <h3 id="cookie-settings-title" className="text-lg text-zinc-50">কুকি সেটিংস</h3>
              <p className="mt-1 text-xs text-zinc-400">
                আপনার পছন্দ অনুযায়ী নিয়ন্ত্রণ করুন
              </p>
            </div>

            <div className="mb-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-50">প্রয়োজনীয় কুকি</p>
                  <p className="text-xs text-zinc-400">
                    সাইট সঠিকভাবে চালানোর জন্য আবশ্যক
                  </p>
                </div>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                  সর্বদা চালু
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-50">অ্যানালিটিক্স</p>
                  <p className="text-xs text-zinc-400">
                    সাইট ব্যবহারের পরিসংখ্যান ও উন্নতি
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="অ্যানালিটিক্স কুকি পরিবর্তন করুন"
                  aria-pressed={cookieSettings.analytics}
                  onClick={() =>
                    setCookieSettings({
                      ...cookieSettings,
                      analytics: !cookieSettings.analytics,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${cookieSettings.analytics ? "bg-zinc-700" : "bg-zinc-800"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-zinc-900 shadow transition duration-200 ease-in-out ${cookieSettings.analytics ? "translate-x-4.5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-50">মার্কেটিং / অ্যাডস</p>
                  <p className="text-xs text-zinc-400">
                    ব্যক্তিগতকৃত বিজ্ঞাপন দেখানোর জন্য
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="মার্কেটিং কুকি পরিবর্তন করুন"
                  aria-pressed={cookieSettings.marketing}
                  onClick={() =>
                    setCookieSettings({
                      ...cookieSettings,
                      marketing: !cookieSettings.marketing,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${cookieSettings.marketing ? "bg-zinc-700" : "bg-zinc-800"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-zinc-900 shadow transition duration-200 ease-in-out ${cookieSettings.marketing ? "translate-x-4.5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>

            <p className="mb-4 text-xs text-zinc-400">
              বিস্তারিত জানতে{" "}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-2 text-zinc-300 hover:text-zinc-50"
              >
                গোপনীয়তা নীতি
              </Link>{" "}
              দেখুন।
            </p>

            <div className="flex gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => saveConsent(false, true)}
                className="w-full rounded-lg px-2 py-1 text-sm text-zinc-300 hover:bg-zinc-800 sm:w-auto"
              >
                শুধু প্রয়োজনীয়
              </button>
              <button
                type="button"
                onClick={() => saveConsent()}
                className="w-full rounded-lg bg-zinc-800 px-2 py-1 text-sm text-zinc-50 hover:bg-zinc-700 sm:w-auto"
              >
                সংরক্ষণ করুন
              </button>
              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="rounded-lg bg-zinc-700 px-2 py-1 text-sm text-zinc-50 hover:bg-zinc-600"
              >
                সব গ্রহণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
