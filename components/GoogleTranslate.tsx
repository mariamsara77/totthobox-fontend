"use client";

import { useEffect, useState } from "react";
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

function readCookie(name: string) {
  const prefix = name + "=";
  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(prefix))
      ?.slice(prefix.length) ?? ""
  );
}

export default function GoogleTranslate() {
  const [shouldLoadTranslator, setShouldLoadTranslator] = useState(false);

  useEffect(() => {
    const existingTranslation = readCookie("googtrans");
    const savedPreference = window.localStorage.getItem(
      "totthobox-translate-language",
    );
    const manualPreference =
      window.localStorage.getItem("totthobox-translate-manual") === "1";

    // Ignore stale auto-detected preferences from older builds.
    const hasActivePreference =
      manualPreference &&
      ((Boolean(existingTranslation) && !existingTranslation.endsWith("/bn")) ||
        (Boolean(savedPreference) && savedPreference !== "bn"));

    if (hasActivePreference) setShouldLoadTranslator(true);
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="hidden"
      />

      {shouldLoadTranslator && (
        <>
          <Script
            id="google-translate-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html:
                "window.googleTranslateElementInit = function () {" +
                "if (window.google && window.google.translate && window.google.translate.TranslateElement) {" +
                "new window.google.translate.TranslateElement({" +
                "pageLanguage:'bn',autoDisplay:false,includedLanguages:'bn,en,hi,ur,ar,es,fr,de,pt,ru,zh-CN,ja,ko,tr,ms,id,it,nl,fa,th,vi,pl,uk,he'" +
                "},'google_translate_element');" +
                "}};",
            }}
          />
          <Script
            id="google-translate-script"
            strategy="lazyOnload"
            src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          />
        </>
      )}
    </>
  );
}
