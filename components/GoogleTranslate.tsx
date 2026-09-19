"use client";

import Script from "next/script";

export default function GoogleTranslate() {
  return (
    <>
      {/* গুগল ট্রান্সলেটের হিডেন কন্টেইনার - এটি ছাড়া গুগল স্ক্রিপ্ট কাজ করতে এরর দিতে পারে */}
      <div id="google_translate_element" style={{ display: "none" }} />

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
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </>
  );
}