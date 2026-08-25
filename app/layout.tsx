import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import TagManager from "@/components/partials/TagManager";
import GoogleTranslate from "@/components/GoogleTranslate";
import VisitorTracker from "@/components/VisitorTracker";
import PWARegister from "@/components/PWARegister";

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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Totthobox",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
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
        <TagManager />
        <PWARegister />
        <AppProviders>
          {children}
          <VisitorTracker />
          <SettingsModalWrapper />
        </AppProviders>
        <GoogleTranslate />
      </body>
    </html>
  );
}
