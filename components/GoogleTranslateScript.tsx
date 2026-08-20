"use client";

import Script from "next/script";

export default function GoogleTranslateScript() {
  return (
    <>
      <div id="google_translate_element" className="hidden" style={{ display: "none" }} />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'bn',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />
      <Script
        id="google-translate-script"
        strategy="afterInteractive"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </>
  );
}