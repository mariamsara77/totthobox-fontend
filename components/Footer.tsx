"use client";

import Link from "next/link";
import { useState } from "react";
// import { Send, Mail, Settings2 } from "lucide-react";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { RxSwitch } from "react-icons/rx";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

// Lucide-এ Facebook & Twitter আইকন না থাকায় Custom SVG Component

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookieSettings, setCookieSettings] = useState(() => {
    if (typeof window === "undefined") {
      return { analytics: true, marketing: true };
    }

    const saved = localStorage.getItem("cookie_consent");
    if (!saved) {
      return { analytics: true, marketing: true };
    }

    try {
      const data = JSON.parse(saved);
      return {
        analytics: data.analytics ?? true,
        marketing: data.marketing ?? true,
      };
    } catch {
      if (saved === "necessary") {
        return { analytics: false, marketing: false };
      }
      return { analytics: true, marketing: true };
    }
  });

  // কুকি সেভ করার ফাংশন
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
    <footer className="border-t border-zinc-400/25 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        {/* Navigation + Cookie Button */}
        <nav
          className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          aria-label="ফুটার লিংক"
        >
          <Link
            href="/about-us"
            className="hover:opacity-50"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:opacity-50"
          >
            গোপনীয়তা নীতি
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:opacity-50"
          >
            ব্যবহারের শর্তাবলী
          </Link>
          <Link
            href="/contact-us"
            className="hover:opacity-50"
          >
            যোগাযোগ
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-zinc-800 px-2.5 py-1 text-xs  text-zinc-50  hover:bg-zinc-700"
          >
            <RxSwitch className="w-4 h-4" /> কুকি সেটিংস
          </button>
        </nav>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          <a
            href="https://facebook.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Facebook"
          >
            <FaFacebook className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="X"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://t.me/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Telegram"
          >
            <FaTelegramPlane className="w-5 h-5" />
          </a>
          <a
            href="mailto:admin@totthobox.com"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Email"
          >
            <SiGmail className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center space-y-1">
          <p className="text-sm  text-zinc-300">
            &copy; {new Date().getFullYear()} Totthobox. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-zinc-400">
            নির্ভরযোগ্য তথ্য ও সহজ ডিজিটাল সেবার প্রতিশ্রুতি।
          </p>
        </div>
      </div>

      {/* ====================== */}
      {/* Cookie Consent Modal   */}
      {/* ====================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 mt-20 ml-35 flex items-center justify-center duration-200">
          <div className="rounded-xl border border-zinc-400/25 bg-zinc-950 p-4 duration-200">
            {/* Header */}
            <div className="mb-3">
              <h3 className="text-lg  text-zinc-50">
                কুকি সেটিংস
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                আপনার পছন্দ অনুযায়ী নিয়ন্ত্রণ করুন
              </p>
            </div>

            {/* Options */}
            <div className="mb-4 space-y-4">
              {/* Necessary */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm  text-zinc-50">
                    প্রয়োজনীয় কুকি
                  </p>
                  <p className="text-xs text-zinc-400">
                    সাইট সঠিকভাবে চালানোর জন্য আবশ্যক
                  </p>
                </div>
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs  text-zinc-300">
                  সর্বদা চালু
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm  text-zinc-50">
                    অ্যানালিটিক্স
                  </p>
                  <p className="text-xs text-zinc-400">
                    সাইট ব্যবহারের পরিসংখ্যান ও উন্নতি
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCookieSettings({
                      ...cookieSettings,
                      analytics: !cookieSettings.analytics,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full  duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${cookieSettings.analytics ? "bg-zinc-700" : "bg-zinc-800"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-zinc-900 shadow transition duration-200 ease-in-out ${cookieSettings.analytics ? "translate-x-4.5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm  text-zinc-50">
                    মার্কেটিং / অ্যাডস
                  </p>
                  <p className="text-xs text-zinc-400">
                    ব্যক্তিগতকৃত বিজ্ঞাপন দেখানোর জন্য
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCookieSettings({
                      ...cookieSettings,
                      marketing: !cookieSettings.marketing,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full  duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${cookieSettings.marketing ? "bg-zinc-700" : "bg-zinc-800"}`}
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
 
            {/* Actions */}
            <div className="flex gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => saveConsent(false, true)}
                className="w-full rounded-lg px-2 py-1 text-sm  text-zinc-300  hover:bg-zinc-800 sm:w-auto"
              >
                শুধু প্রয়োজনীয়
              </button>
 
              <button
                type="button"
                onClick={() => saveConsent()}
                className="w-full rounded-lg bg-zinc-800 px-2 py-1 text-sm  text-zinc-50  hover:bg-zinc-700 sm:w-auto"
              >
                সংরক্ষণ করুন
              </button>
 
              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="rounded-lg bg-zinc-700 px-2 py-1 text-sm  text-zinc-50  hover:bg-zinc-600"
              >
                সব গ্রহণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
