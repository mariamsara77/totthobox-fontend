import type { Metadata, Viewport } from "next"; // Viewport ইম্পোর্ট করা হয়েছে
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import TagManager from "@/components/partials/TagManager";
import GoogleTranslate from "@/components/GoogleTranslate";
import VisitorTracker from "@/components/VisitorTracker";
import InstallPWA from "@/components/InstallPWA"; // PWA Install Button
import NetworkStatus from "@/components/NetworkStatus"; // Offline Banner

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

// ১. PWA Metadata আপডেট
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
  // iOS/Safari PWA সাপোর্ট
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Totthobox",
  },
  formatDetection: {
    telephone: false,
  },
};

// ২. Viewport আলাদা কনফিগারেশন (Next.js 14+ এর জন্য আবশ্যক)
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <head />
      <body
        suppressHydrationWarning
        className="min-h-screen dark:bg-zinc-800 antialiased"
      >
        <NetworkStatus /> {/* অফলাইন এলার্ট ব্যানার */}
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
