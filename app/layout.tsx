import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Noto_Sans_Bengali, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { APPEARANCE_INIT_SCRIPT } from "@/lib/appearance";
import TagManager from "@/components/partials/TagManager";
import RouteTracker from "@/components/analytics/RouteTracker";
import DeferredVisitorTracker from "@/components/DeferredVisitorTracker";
import InstallPWA from "@/components/InstallPWA";
import NetworkStatus from "@/components/NetworkStatus";
import PWAUpdateToast from "@/components/pwa/PWAUpdateToast";
import SiteStructuredData from "@/components/seo/SiteStructuredData";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";

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

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
const ADSENSE_ENABLED =
  process.env.ADSENSE_ENABLED === "true" &&
  process.env.ADSENSE_CMP_READY === "true" &&
  /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT ?? "");

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: {
    default: "Totthobox - প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
  alternates: {
    canonical: "https://totthobox.com",
    languages: {
      "bn-BD": "https://totthobox.com",
      "bn": "https://totthobox.com",
      "x-default": "https://totthobox.com",
    },
  },
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
    description: "প্রয়োজনীয় তথ্য ও ডিজিটাল সেবা এক জায়গায়",
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
    description: "প্রয়োজনীয় তথ্য ও ডিজিটাল সেবা এক জায়গায়",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Totthobox",
  },
  formatDetection: { telephone: false },
  ...(ADSENSE_ENABLED && ADSENSE_CLIENT
    ? { other: { "google-adsense-account": ADSENSE_CLIENT } }
    : {}),
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

const ENV_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const GTM_ID = ENV_GTM_ID || "GTM-5RFHKJJJ";

if (process.env.NODE_ENV !== "production" && !ENV_GTM_ID) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Totthobox Analytics Warning] NEXT_PUBLIC_GTM_ID is not defined in environment variables. Falling back to 'GTM-5RFHKJJJ'. To configure your own container, set NEXT_PUBLIC_GTM_ID in your hosting dashboard and .env.local.",
  );
}

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
        notoBengali.variable +
        " " +
        hindSiliguri.variable
      }
    >
      <head>
        <script
          id="appearance-init"
          dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }}
        />
        <meta name="author" content="Totthobox Team" />
        <meta property="fb:app_id" content="1108131871544005" />
        <meta
          name="vapid-public-key"
          content={
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
            "BBXFXNIJfoxxN-BC24pweOIBTZIHEmR9_XbbRyuqGyncTQnzKmhm65R4HGaZPYrdoLfkimilv3U4he7CK0_paBU"
          }
        />
        {/* Consent Mode v2 Default (Executes BEFORE GTM container loads) */}
        <script
          id="gtm-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;

              // 1. Region-specific default: Denied for EEA, UK (GB) and Switzerland (CH)
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted',
                'region': [
                  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
                  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
                  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
                  'GB', 'CH'
                ]
              });

              // 2. Global default: Granted for all other visitors
              gtag('consent', 'default', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
              });

              gtag('set', 'ads_data_redaction', true);

              // 3. Saved visitor choice overrides defaults on load, before GTM fires
              try {
                var raw = localStorage.getItem('cookie_consent');
                if (raw) {
                  var c = JSON.parse(raw);
                  gtag('consent', 'update', {
                    'analytics_storage': c.analytics ? 'granted' : 'denied',
                    'ad_storage': c.marketing ? 'granted' : 'denied',
                    'ad_user_data': c.marketing ? 'granted' : 'denied',
                    'ad_personalization': c.marketing ? 'granted' : 'denied'
                  });
                }
              } catch(e) {}
            `,
          }}
        />
        {/* ONE GTM Container loaded once in root layout via next/script */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <RouteTracker />
        <SiteStructuredData />
        <TagManager />
        <NetworkStatus />
        <AppProviders>
          {children}
          <MobileBottomNav />
        </AppProviders>
        <DeferredVisitorTracker />
        <InstallPWA />
        <PWAUpdateToast />
      </body>
    </html>
  );
}
