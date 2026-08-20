"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
// import { Send, Mail, Settings2 } from "lucide-react";
import { FaFacebook, FaTwitter, FaTelegramPlane, FaMailBulk } from "react-icons/fa";
import { RxSwitch } from "react-icons/rx";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";


// Lucide-এ Facebook & Twitter আইকন না থাকায় Custom SVG Component


export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    analytics: true,
    marketing: true,
  });

  // লোকাল স্টোরেজ থেকে কুকি ডেটা লোড
  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCookieSettings({
          analytics: data.analytics ?? true,
          marketing: data.marketing ?? true,
        });
      } catch (e) {
        if (saved === "necessary") {
          setCookieSettings({ analytics: false, marketing: false });
        }
      }
    }
  }, []);

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
        <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6" aria-label="ফুটার লিংক">
          <Link href="/about-us" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            আমাদের সম্পর্কে
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            গোপনীয়তা নীতি
          </Link>
          <Link href="/terms-of-service" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            ব্যবহারের শর্তাবলী
          </Link>
          <Link href="/contact-us" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            যোগাযোগ
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-0.2 px-2 rounded-full transition-colors"
          >
            <RxSwitch className="w-4 h-4" /> কুকি সেটিংস
          </button>
        </nav>

        {/* Social Links */}
<div className="flex items-center gap-2">
  <a href="https://facebook.com/totthobox" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-all" aria-label="Facebook">
    <FaFacebook className="w-5 h-5" />
  </a>
  <a href="https://x.com/totthobox" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-all" aria-label="X">
    <FaXTwitter className="w-5 h-5" />
  </a>
  <a href="https://t.me/totthobox" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-all" aria-label="Telegram">
    <FaTelegramPlane className="w-5 h-5" />
  </a>
  <a href="mailto:admin@totthobox.com" className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-all" aria-label="Email">
    <SiGmail className="w-5 h-5" />
  </a>
</div>

        {/* Copyright */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Totthobox. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            নির্ভরযোগ্য তথ্য ও সহজ ডিজিটাল সেবার প্রতিশ্রুতি।
          </p>
        </div>
      </div>

      {/* ====================== */}
      {/* Cookie Consent Modal   */}
      {/* ====================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">কুকি সেটিংস</h3>
              <p className="text-xs text-zinc-500 mt-1">আপনার পছন্দ অনুযায়ী নিয়ন্ত্রণ করুন</p>
            </div>

            {/* Options */}
            <div className="space-y-5 mb-6">
              {/* Necessary */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">প্রয়োজনীয় কুকি</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">সাইট সঠিকভাবে চালানোর জন্য আবশ্যক</p>
                </div>
                <span className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md">
                  সর্বদা চালু
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">অ্যানালিটিক্স</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">সাইট ব্যবহারের পরিসংখ্যান ও উন্নতি</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCookieSettings({ ...cookieSettings, analytics: !cookieSettings.analytics })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${cookieSettings.analytics ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${cookieSettings.analytics ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">মার্কেটিং / অ্যাডস</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">ব্যক্তিগতকৃত বিজ্ঞাপন দেখানোর জন্য</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCookieSettings({ ...cookieSettings, marketing: !cookieSettings.marketing })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${cookieSettings.marketing ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${cookieSettings.marketing ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-6">
              বিস্তারিত জানতে <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-300">গোপনীয়তা নীতি</Link> দেখুন।
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => saveConsent(false, true)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                শুধু প্রয়োজনীয়
              </button>
              
              <button
                type="button"
                onClick={() => saveConsent()}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg transition-colors"
              >
                সংরক্ষণ করুন
              </button>

              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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