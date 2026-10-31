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

// Service workers cannot read Cookie or Set-Cookie headers. This allowlist is therefore
// limited to routes whose HTML is public and identical for anonymous and signed-in users.
// The response must also explicitly opt in with Cache-Control: public.
// Only explicitly public, query-free HTML documents may enter the runtime cache.
// All RSC payloads (including prefetches), API calls, and non-allowlisted pages
// stay NetworkOnly. Do not add a route here unless it is genuinely public and
// never varies by account, cookie, authorization, or user-specific state.
const publicResponseCacheabilityPlugin = {
  cacheWillUpdate: async ({ request, response }: {
    request: Request;
    response: Response;
  }): Promise<Response | null> => {
    if (
      request.method !== "GET" ||
      request.credentials === "include" ||
      request.headers.has("authorization") ||
      new URL(request.url).origin !== self.location.origin ||
      request.mode !== "navigate" ||
      !response ||
      response.status !== 200 ||
      response.redirected ||
      response.type !== "basic" ||
      !response.headers.get("content-type")?.toLowerCase().includes("text/html")
    ) {
      return null;
    }

    const cacheControl = (response.headers.get("cache-control") ?? "")
      .split(",")
      .map((directive) => directive.trim().split("=", 1)[0].toLowerCase());
    const vary = (response.headers.get("vary") ?? "")
      .split(",")
      .map((header) => header.trim().toLowerCase());

    if (
      !cacheControl.includes("public") ||
      cacheControl.some((directive) =>
        ["private", "no-store", "no-cache"].includes(directive),
      ) ||
      vary.includes("*") ||
      vary.some((header) => ["cookie", "authorization"].includes(header))
    ) {
      return null;
    }

    return response;
  },
};

const publicDocumentCaching: RuntimeCaching = {
  handler: "NetworkFirst",
  method: "GET",
  urlPattern: ({ request, url }) =>
    request.mode === "navigate" &&
    url.origin === self.location.origin &&
    url.search === "" &&
    new RegExp("^/(?:$|about-us(?:/|$)|contact-us(?:/|$)|services(?:/|$)|privacy-policy(?:/|$)|terms-of-service(?:/|$)|bangla(?:/|$)|bangladesh(?:/|$)|international(?:/|$)|islam(?:/|$)|converter(?:/|$)|pdf-editor(?:/|$)|tools(?:/|$)|software(?:/|$)|signs(?:/|$)|contact/police(?:/|$)|news/headlines(?:/|$))", "i").test(url.pathname),
  options: {
    cacheName: "public-document-pages-v3",
    networkTimeoutSeconds: 4,
    expiration: {
      maxEntries: 80,
      maxAgeSeconds: 30 * 60,
    },
    plugins: [publicResponseCacheabilityPlugin],
  },
};

// These rules deliberately precede the public HTML rule. RSC payloads can
// contain personalized server-component data, including during Next.js
// prefetches, and are never persisted by the service worker.
const rscNetworkOnlyCaching: RuntimeCaching = {
  handler: "NetworkOnly",
  method: "GET",
  urlPattern: ({ request, sameOrigin }) =>
    sameOrigin &&
    (request.headers.get("RSC") === "1" ||
      request.headers.get("Next-Router-Prefetch") === "1" ||
      request.headers.get("Accept")?.includes("text/x-component") === true),
};

const apiNetworkOnlyCaching: RuntimeCaching = {
  handler: "NetworkOnly",
  method: "GET",
  urlPattern: ({ url }) => /^\/api(?:\/|$)/i.test(url.pathname),
};

const nonPublicNavigationNetworkOnlyCaching: RuntimeCaching = {
  handler: "NetworkOnly",
  method: "GET",
  urlPattern: ({ request, url }) =>
    request.mode === "navigate" &&
    url.origin === self.location.origin &&
    (url.search !== "" || !new RegExp("^/(?:$|about-us(?:/|$)|contact-us(?:/|$)|services(?:/|$)|privacy-policy(?:/|$)|terms-of-service(?:/|$)|bangla(?:/|$)|bangladesh(?:/|$)|international(?:/|$)|islam(?:/|$)|converter(?:/|$)|pdf-editor(?:/|$)|tools(?:/|$)|software(?:/|$)|signs(?:/|$)|contact/police(?:/|$)|news/headlines(?:/|$))", "i").test(url.pathname)),
};

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  // The plugin's front-end navigation helper writes successful responses
  // directly to its "pages" cache, bypassing Workbox cacheability plugins.
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  reloadOnOnline: true,
  // Replacing defaults is essential: the defaults cache all same-origin
  // documents and RSC/RSC-prefetch responses without checking Cache-Control.
  extendDefaultRuntimeCaching: false,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    importScripts: ["/sw-cache-cleanup.js"],
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      publicDocumentCaching,
      rscNetworkOnlyCaching,
      apiNetworkOnlyCaching,
      nonPublicNavigationNetworkOnlyCaching,
    ],
  },
});

export default isDev ? nextConfig : withPWA(nextConfig);
