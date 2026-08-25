import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import TagManager from "@/components/partials/TagManager";
import GoogleTranslate from "@/components/GoogleTranslate";
import VisitorTracker from "@/components/VisitorTracker";
import PWARegister from "@/components/PWARegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const notoBengali = Noto_Sans_Bengali({ variable: "--font-noto-bengali", subsets: ["bengali"], weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: { default: "Totthobox - প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়", template: "%s | Totthobox" },
  description: "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম।",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: "Totthobox", statusBarStyle: "black-translucent" },
  openGraph: { type: "website", siteName: "Totthobox", locale: "bn_BD", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Totthobox" }] },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111827",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable}`}>
      <head />
      <body suppressHydrationWarning className="min-h-screen dark:bg-zinc-800 antialiased">
        <TagManager />
        <PWARegister />
        <AppProviders>
          {children}
          <VisitorTracker />
          <SettingsModalWrapper />
        </AppProviders>
        <GoogleTranslate />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
