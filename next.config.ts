import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import type { RuntimeCaching } from "workbox-build";

const isDev = process.env.NODE_ENV === "development";

// Only stable public routes are eligible for shared CDN caching.
// Authenticated/account/API routes are deliberately not included.
const publicPageSources = [
  "/",
  "/about-us",
  "/contact-us",
  "/services",
  "/privacy-policy",
  "/terms-of-service",
  "/bangla/:path*",
  "/bangladesh/:path*",
  "/international/:path*",
  "/islam/:path*",
  "/converter/:path*",
  "/pdf-editor",
  "/tools/:path*",
  "/software/:path*",
  "/signs/:path*",
  "/contact/police",
];

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "totthobox.com" },
      { protocol: "https", hostname: "admin.totthobox.com" },
      { protocol: "https", hostname: "**.totthobox.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
    // Keep generated image variants cached to reduce repeated image transformations.
    // A long TTL is a cache retention target, not a guarantee of avoiding all transforms.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compiler: {
    removeConsole: !isDev,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(!isDev
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },

      // Keep long-lived caching limited to stable/versioned public assets.
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icons/v1/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // Stable, source-controlled public icons. Change the URL when replacing
      // one of these assets so immutable client caches can be invalidated safely.
      ...[
        "/apple-touch-icon.png",
        "/favicon-16x16.png",
        "/favicon-32x32.png",
        "/favicon-96x96.png",
        "/favicon.svg",
        "/web-app-manifest-192x192.png",
        "/web-app-manifest-512x512.png",
      ].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      })),

      // Public routes only. Vercel can serve a fresh cached representation
      // while revalidating stale content in the background.
      ...publicPageSources.map((source) => ({
        source,
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      })),

      // News has a shorter freshness window than stable informational pages.
      ...[
        "/news/headlines",
        "/news/headlines/:slug",
        "/news/headlines/story/:slug",
      ].map((source) => ({
        source,
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      })),
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },

      // Private pages and APIs must never be shared-cached.
      ...[
        "/api/:path*",
        "/api/auth/:path*",
        "/auth/:path*",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/dashboard",
        "/dashboard/:path*",
        "/profile",
        "/profile/:path*",
        "/settings",
        "/settings/:path*",
        "/messages",
        "/messages/:path*",
        "/account/:path*",
        "/admin/:path*",
        "/ai/chat/:path*",
        "/offline",
      ].map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0, must-revalidate",
          },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Vercel-CDN-Cache-Control", value: "no-store" },
        ],
      })),
    ];
  },

  experimental: {
    // Inline the small route CSS manifests into HTML so the first render does
    // not wait on separate render-blocking stylesheet requests.
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
};

// Cache only known public, query-free document routes. This explicit allowlist
// keeps authentication, account, admin, API, and unknown routes out of the service-worker HTML cache.
const publicDocumentPath =
  /^\/(?:$|about-us(?:\/|$)|contact-us(?:\/|$)|services(?:\/|$)|privacy-policy(?:\/|$)|terms-of-service(?:\/|$)|bangla(?:\/|$)|bangladesh(?:\/|$)|international(?:\/|$)|islam(?:\/|$)|converter(?:\/|$)|pdf-editor(?:\/|$)|tools(?:\/|$)|software(?:\/|$)|signs(?:\/|$)|contact\/police(?:\/|$)|news\/headlines(?:\/|$))/i;

const publicDocumentCaching: RuntimeCaching = {
  handler: "CacheFirst",
  method: "GET",
  urlPattern: ({ request, url }) =>
    request.mode === "navigate" &&
    url.origin === self.location.origin &&
    url.search === "" &&
    publicDocumentPath.test(url.pathname),
  options: {
    cacheName: "public-document-pages-v2",
    expiration: {
      maxEntries: 80,
      maxAgeSeconds: 30 * 60,
    },
  },
};

// Reuse optimized and public image/font assets for a week on repeat visits.
const publicAssetCaching: RuntimeCaching = {
  handler: "CacheFirst",
  method: "GET",
  urlPattern: ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname === "/_next/image" ||
      /\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(url.pathname)),
  options: {
    cacheName: "public-image-font-assets-v1",
    expiration: {
      maxEntries: 160,
      maxAgeSeconds: 7 * 24 * 60 * 60,
    },
  },
};

const apiNetworkOnlyCaching: RuntimeCaching = {
  handler: "NetworkOnly",
  method: "GET",
  options: {
    cacheName: "api-network-only",
  },
  urlPattern: /^https?:\/\/[^/]+\/api(?:\/|$)/i,
};

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    // Custom routes run before defaults: cache safe public pages, never API responses.
    runtimeCaching: [publicDocumentCaching, publicAssetCaching, apiNetworkOnlyCaching],
  },
});

export default isDev ? nextConfig : withPWA(nextConfig);
