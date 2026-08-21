import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "../providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import TagManager from "@/components/partials/TagManager";
import { SidebarProvider } from "@/context/SidebarContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import GoogleTranslate from "@/components/GoogleTranslate"; // <-- ইমপোর্ট করা হলো

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: {
    default: "Totthobox - আপনার প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
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
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-white dark:bg-zinc-800 text-slate-900 transition-colors duration-200 selection:bg-emerald-500 selection:text-white dark:text-slate-50"
      >
        <TagManager/>
        <SidebarProvider>
          <SettingsModalProvider>
            <ThemeProvider>
              <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content area */}
                <div className="flex min-h-screen flex-1 flex-col">
                  <div className="md:hidden">
                    <Navbar />
                  </div>

                  <main className="flex-1 w-full">{children}</main>
                  <Footer />
                </div>
              </div>
              <SettingsModalWrapper />
            </ThemeProvider>
          </SettingsModalProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}