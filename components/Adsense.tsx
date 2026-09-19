// components/Adsense.tsx
import Script from "next/script";

export default function Adsense() {
  const pId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!pId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive" // পেজ লোড ফাস্ট করবে
    />
  );
}
