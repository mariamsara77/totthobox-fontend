import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "../providers"; // আপনার path
import Head from "@/components/partials/Head";
import TagManager from "@/components/partials/TagManager";

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
    default: "Totthobox",
    template: "%s | Totthobox",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} h-full antialiased`}
    >
       <head>
                   <Head/>
                  </head>
           
      <body
        suppressHydrationWarning
        className="min-h-full bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-50"
      >
           <TagManager/>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}