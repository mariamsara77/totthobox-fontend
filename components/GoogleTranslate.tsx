"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: {
          pageLanguage: string;
          autoDisplay?: boolean;
          includedLanguages?: string;
        }, elementId: string) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGE_OPTIONS = [
  ["bn", "বাংলা"],
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["ur", "اردو"],
  ["ar", "العربية"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["pt", "Português"],
  ["ru", "Русский"],
  ["zh-CN", "中文"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["tr", "Türkçe"],
  ["ms", "Bahasa Melayu"],
] as const;

const LANGUAGE_ALIASES: Record<string, string> = {
  "zh": "zh-CN",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  "pt-br": "pt",
  "iw": "he",
  "he-il": "he",
  "in": "id",
  "id-id": "id",
};

function normalizeLanguage(value: string | undefined) {
  if (!value) return "en";

  const normalized = value.trim().toLowerCase().replace("_", "-");
  const base = normalized.split("-")[0];

  return LANGUAGE_ALIASES[normalized] ?? LANGUAGE_ALIASES[base] ?? base;
}

function readCookie(name: string) {
  const prefix = `${name}=`;
  return document.cookie.split("; ").find((cookie) => cookie.startsWith(prefix))?.slice(prefix.length) ?? "";
}

function setTranslationCookie(language: string) {
  document.cookie = `googtrans=/bn/${language}; path=/; max-age=31536000; samesite=lax`;
}

function clearTranslationCookie() {
  document.cookie = "googtrans=; path=/; max-age=0; samesite=lax";
}

function reloadForLanguage(language: string) {
  if (language === "bn") {
    clearTranslationCookie();
  } else {
    setTranslationCookie(language);
  }

  window.location.reload();
}

export default function GoogleTranslate() {
  const [country, setCountry] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("bn");
  const [showSelector, setShowSelector] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const existingTranslation = readCookie("googtrans");
    const savedPreference = window.localStorage.getItem("totthobox-translate-language");
    const manualPreference =
      window.localStorage.getItem("totthobox-translate-manual") === "1";

    if (existingTranslation) {
      const currentLanguage = existingTranslation.split("/").pop() || "bn";
      setTargetLanguage(currentLanguage);
    } else if (savedPreference) {
      setTargetLanguage(savedPreference);
    }

    const checked = window.sessionStorage.getItem("totthobox-geo-translate-checked");
    if (checked) return;

    window.sessionStorage.setItem("totthobox-geo-translate-checked", "1");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);

    void fetch("https://ipapi.co/json/", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Country lookup failed");
        return response.json();
      })
      .then((geo: { country_code?: string; languages?: string }) => {
        const countryCode = geo.country_code?.toUpperCase() || "";
        setCountry(countryCode);

        if (countryCode === "BD") {
          if (!manualPreference) {
            clearTranslationCookie();
            window.localStorage.removeItem("totthobox-translate-language");
          }
          return;
        }

        const preferredLanguage = normalizeLanguage(
          geo.languages?.split(",")[0]?.split(";")[0]
        );

        if (!preferredLanguage || preferredLanguage === "bn") return;

        const alreadyTranslated =
          existingTranslation ||
          savedPreference ||
          window.sessionStorage.getItem("totthobox-translate-language");

        if (alreadyTranslated) return;

        window.localStorage.setItem(
          "totthobox-translate-language",
          preferredLanguage
        );
        setTranslationCookie(preferredLanguage);
        window.location.reload();
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeout);
      });
  }, []);

  const handleLanguageChange = (language: string) => {
    window.localStorage.setItem("totthobox-translate-language", language);
    window.localStorage.setItem("totthobox-translate-manual", "1");
    setTargetLanguage(language);
    reloadForLanguage(language);
  };

  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="hidden"
      />

      <div className="fixed right-3 top-20 z-[60]">
        <button
          type="button"
          onClick={() => setShowSelector((value) => !value)}
          className="rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-200"
          aria-expanded={showSelector}
          aria-label="Language selector"
        >
          🌐 {targetLanguage === "bn" ? "বাংলা" : targetLanguage.toUpperCase()}
        </button>

        {showSelector && (
          <div className="mt-2 w-44 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <label
              htmlFor="totthobox-language"
              className="mb-1.5 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400"
            >
              ভাষা / Language
            </label>
            <select
              id="totthobox-language"
              value={targetLanguage}
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {LANGUAGE_OPTIONS.map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>

            {country && country !== "BD" && (
              <p className="mt-1.5 text-[10px] text-zinc-400">
                Automatically selected for your region.
              </p>
            )}
          </div>
        )}
      </div>

      <Script
        id="google-translate-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.googleTranslateElementInit = function () {
              if (
                window.google &&
                window.google.translate &&
                window.google.translate.TranslateElement
              ) {
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: "bn",
                    autoDisplay: false,
                    includedLanguages: "bn,en,hi,ur,ar,es,fr,de,pt,ru,zh-CN,ja,ko,tr,ms",
                  },
                  "google_translate_element"
                );
              }
            };
          `,
        }}
      />

      <Script
        id="google-translate-script"
        strategy="lazyOnload"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </>
  );
}
