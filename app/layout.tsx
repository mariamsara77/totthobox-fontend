import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google"; // ফন্ট ইম্পোর্ট
import "./globals.css";
import { AppProviders } from "./providers";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import TagManager from "@/components/partials/TagManager";
import GoogleTranslate from "@/components/GoogleTranslate";
import VisitorTracker from "@/components/VisitorTracker";

// ফন্টগুলোর কনফিগারেশন
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
    default: "Totthobox - আপনার প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
};

// app/layout.tsx

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
      {/* body ট্যাগে suppressHydrationWarning যুক্ত করা হয়েছে */}
      <body
        suppressHydrationWarning
        className="min-h-screen dark:bg-zinc-800 dark:text-white antialiased"
      >
        <TagManager />
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