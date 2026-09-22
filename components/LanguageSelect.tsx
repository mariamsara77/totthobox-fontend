"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

const languages = [
  { code: "bn", label: "বাংলা", native: "Original" },
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "हिन्दी", native: "Hindi" },
  { code: "ur", label: "اردو", native: "Urdu" },
  { code: "ar", label: "العربية", native: "Arabic" },
  { code: "es", label: "Español", native: "Spanish" },
  { code: "fr", label: "Français", native: "French" },
  { code: "de", label: "Deutsch", native: "German" },
  { code: "pt", label: "Português", native: "Portuguese" },
  { code: "ru", label: "Русский", native: "Russian" },
  { code: "zh-CN", label: "中文", native: "Chinese" },
  { code: "ja", label: "日本語", native: "Japanese" },
  { code: "ko", label: "한국어", native: "Korean" },
  { code: "tr", label: "Türkçe", native: "Turkish" },
  { code: "ms", label: "Bahasa Melayu", native: "Malay" },
  { code: "id", label: "Bahasa Indonesia", native: "Indonesian" },
  { code: "it", label: "Italiano", native: "Italian" },
  { code: "nl", label: "Nederlands", native: "Dutch" },
  { code: "fa", label: "فارسی", native: "Persian" },
  { code: "th", label: "ไทย", native: "Thai" },
  { code: "vi", label: "Tiếng Việt", native: "Vietnamese" },
  { code: "pl", label: "Polski", native: "Polish" },
  { code: "uk", label: "Українська", native: "Ukrainian" },
  { code: "he", label: "עברית", native: "Hebrew" },
] as const;

function readTranslationLanguage() {
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  return match?.[1]?.split("/").pop() || "bn";
}

function clearTranslationCookie() {
  document.cookie = "googtrans=; path=/; max-age=0; samesite=lax";
  document.cookie =
    "googtrans=; path=/; max-age=0; samesite=lax; domain=.totthobox.com";
}

function setTranslationCookie(language: string) {
  document.cookie =
    `googtrans=/bn/${language}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSelect() {
  const [currentLang, setCurrentLang] = useState("bn");

  useEffect(() => {
    const cookieLanguage = readTranslationLanguage();
    const savedLanguage = window.localStorage.getItem(
      "totthobox-translate-language"
    );

    setCurrentLang(
      cookieLanguage !== "bn" ? cookieLanguage : savedLanguage || "bn"
    );
  }, []);

  const handleLanguageChange = (targetLang: string) => {
    setCurrentLang(targetLang);
    window.localStorage.setItem("totthobox-translate-language", targetLang);
    window.localStorage.setItem("totthobox-translate-manual", "1");

    if (targetLang === "bn") {
      clearTranslationCookie();
    } else {
      setTranslationCookie(targetLang);
    }

    window.location.reload();
  };

  const selected =
    languages.find((language) => language.code === currentLang) ?? languages[0];

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-zinc-400/5 p-4 dark:border-zinc-700/80 dark:bg-zinc-400/5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-400/10 text-zinc-700 dark:text-zinc-200">
          <Languages className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                ভাষা
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                বর্তমান ভাষা: {selected.label}
              </p>
            </div>
            <span className="rounded-full bg-zinc-400/10 px-2 py-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              {currentLang === "bn" ? "Original" : "Translated"}
            </span>
          </div>

          <label htmlFor="totthobox-language" className="sr-only">
            ভাষা নির্বাচন
          </label>
          <select
            id="totthobox-language"
            value={currentLang}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.code === "bn"
                  ? `Original (Bangla) — ${language.label}`
                  : `${language.label} — ${language.native}`}
              </option>
            ))}
          </select>

          <p className="mt-2 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
            বাংলা বেছে নিলে মূল বাংলা কনটেন্টে ফিরে যাবে।
          </p>
        </div>
      </div>
    </section>
  );
}
