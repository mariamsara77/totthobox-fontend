"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            autoDisplay?: boolean;
            includedLanguages?: string;
          },
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGE_CODES = [
  "bn", "en", "hi", "ur", "ar", "es", "fr", "de", "pt", "ru",
  "zh-CN", "ja", "ko", "tr", "ms", "id", "it", "nl", "fa", "th",
  "vi", "pl", "uk", "he",
] as const;

const LANGUAGE_ALIASES: Record<string, string> = {
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  "pt-br": "pt",
  iw: "he",
  "he-il": "he",
  in: "id",
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
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(prefix))
      ?.slice(prefix.length) ?? ""
  );
}

function setTranslationCookie(language: string) {
  document.cookie = `googtrans=/bn/${language}; path=/; max-age=31536000; samesite=lax`;
}

function clearTranslationCookie() {
  document.cookie =
    "googtrans=; path=/; max-age=0; samesite=lax";
  document.cookie =
    "googtrans=; path=/; max-age=0; samesite=lax; domain=.totthobox.com";
}

export default function GoogleTranslate() {
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const existingTranslation = readCookie("googtrans");
    const savedPreference = window.localStorage.getItem(
      "totthobox-translate-language"
    );
    const manualPreference =
      window.localStorage.getItem("totthobox-translate-manual") === "1";

    if (window.sessionStorage.getItem("totthobox-geo-translate-checked")) {
      return;
    }

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

        if (countryCode === "BD") {
          if (!manualPreference) {
            clearTranslationCookie();
            window.localStorage.removeItem("totthobox-translate-language");
            window.localStorage.removeItem("totthobox-translate-manual");
          }
          return;
        }

        if (existingTranslation || savedPreference) return;

        const preferredLanguage = normalizeLanguage(
          geo.languages?.split(",")[0]?.split(";")[0]
        );

        if (
          !preferredLanguage ||
          preferredLanguage === "bn" ||
          !LANGUAGE_CODES.includes(
            preferredLanguage as (typeof LANGUAGE_CODES)[number]
          )
        ) {
          return;
        }

        window.localStorage.setItem(
          "totthobox-translate-language",
          preferredLanguage
        );
        window.localStorage.removeItem("totthobox-translate-manual");
        setTranslationCookie(preferredLanguage);
        window.location.reload();
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeout);
      });
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="hidden"
      />

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
                    includedLanguages: "bn,en,hi,ur,ar,es,fr,de,pt,ru,zh-CN,ja,ko,tr,ms,id,it,nl,fa,th,vi,pl,uk,he",
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
