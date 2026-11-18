"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT } from "@/lib/adsense";

const EXCLUDED_PREFIXES = [
  "/login",
  "/register",
  "/messages",
  "/settings",
  "/dashboard",
  "/admin",
  "/ai",
  "/auth",
];

export default function AdSenseScript() {
  const pathname = usePathname();

  // Never load AdSense on private, sensitive, or authenticated routes
  if (
    pathname &&
    EXCLUDED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
    )
  ) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      data-totthobox-adsense="1"
    />
  );
}
