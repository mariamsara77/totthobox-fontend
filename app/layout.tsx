import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import TagManager from "@/components/partials/TagManager";
import GoogleTranslate from "@/components/GoogleTranslate";
import DeferredAdSense from "@/components/DeferredAdSense";
import DeferredVisitorTracker from "@/components/DeferredVisitorTracker";
import InstallPWA from "@/components/InstallPWA";
import NetworkStatus from "@/components/NetworkStatus";
import SiteStructuredData from "@/components/seo/SiteStructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: {
      default: "তথ্যবক্স — Totthobox",
      template: "%s | Totthobox",
    },
    description: "সর্বশেষ খবর ও তথ্যের বিশ্বস্ত ঠিকানা",
    url: "https://totthobox.com",
    siteName: "Totthobox",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "তথ্যবক্স — Totthobox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "তথ্যবক্স — Totthobox",
    description: "সর্বশেষ খবর ও তথ্যের বিশ্বস্ত ঠিকানা",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Totthobox",
  },
  formatDetection: { telephone: false },
  other: {
    "google-adsense-account":
      process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521",
  },
  verification: {
    google: "1-VsthqfGvXga4zKLbfjBjP6L0UFc-xBQ_aOzn1g9Ps",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
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
      className={
        geistSans.variable +
        " " +
        geistMono.variable +
        " " +
        notoBengali.variable
      }
    >
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5RFHKJJJ');`}
        </Script>
        <meta name="author" content="Totthobox Team" />
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5RFHKJJJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <DeferredAdSense />

        <SiteStructuredData />
        <TagManager />
        <NetworkStatus />
        <AppProviders>{children}</AppProviders>
        <DeferredVisitorTracker />
        <InstallPWA />
        <GoogleTranslate />
      </body>
    </html>
  );
}
