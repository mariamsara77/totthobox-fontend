import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "./providers";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import TagManager from "@/components/partials/TagManager";
import GoogleTranslate from "@/components/GoogleTranslate";
import VisitorTracker from "@/components/VisitorTracker";
import InstallPWA from "@/components/InstallPWA";
import NetworkStatus from "@/components/NetworkStatus";
// Adsense কম্পোনেন্ট আর লাগবে না, নিচে সরাসরি দিয়ে দিলাম

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: {
    default: "Totthobox - প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Totthobox" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Totthobox",
  },
  formatDetection: {
    telephone: false,
  },
  // ========== AdSense Verification (সবচেয়ে গুরুত্বপূর্ণ) ==========
  other: {
    "google-adsense-account":
      process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521",
  },
  // Google Site Verification (যদি আলাদা লাগে)
  verification: {
    google: "1-VsthqfGvXga4zKLbfjBjP6L0UFc-xBQ_aOzn1g9Ps",
  },
  // ================================================================
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable}`}
    >
      <head>
        {/* অতিরিক্ত কাস্টম ট্যাগ এখানে রাখতে পারেন */}
        <meta name="author" content="Totthobox Team" />
        <meta name="robots" content="index, follow" />
        <meta property="fb:app_id" content="1108131871544005" />
        <meta
          name="vapid-public-key"
          content={
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
            "BBXFXNIJfoxxN-BC24pweOIBTZIHEmR9_XbbRyuqGyncTQnzKmhm65R4HGaZPYrdoLfkimilv3U4he7CK0_paBU"
          }
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased bg-white dark:bg-zinc-800"
      >
        {/* ========== AdSense Script (next/script দিয়ে) ========== */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9522604367420521"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* ====================================================== */}

        <NetworkStatus />
        <TagManager />
        <AppProviders>
          {children}
          <VisitorTracker />
          <SettingsModalWrapper />
        </AppProviders>
        <InstallPWA />
        <GoogleTranslate />
      </body>
    </html>
  );
}
