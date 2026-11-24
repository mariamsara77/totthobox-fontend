import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const disallowedPrivate = [
    "/api/",
    "/auth/",
    "/settings/",
    "/ai/",
    "/messages/",
    "/offline",
    "/live-tv", // Aggregator broadcast directory protected from scraper crawlers
  ];

  return {
    rules: [
      // 1. General search engines (Google, Bing, Yahoo, DuckDuckGo)
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPrivate,
      },
      // 2. Google AdSense crawler (must have full access to indexable pages to verify compliance)
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
        disallow: ["/api/", "/auth/", "/settings/", "/ai/", "/messages/"],
      },
      // 3. AI Search Engines (Allowed for generative search grounding and answer citations)
      {
        userAgent: [
          "OAI-SearchBot", // OpenAI Search grounding
          "PerplexityBot", // Perplexity AI live search
          "Bingbot",       // Microsoft Copilot & Bing search
        ],
        allow: "/",
        disallow: disallowedPrivate,
      },
      // 4. AI Training Crawlers (Controlled access to public knowledge, protect user data)
      {
        userAgent: [
          "GPTBot",          // OpenAI Model Training
          "ClaudeBot",        // Anthropic Claude
          "Google-Extended",  // Google Gemini AI Training
        ],
        allow: "/",
        disallow: disallowedPrivate,
      },
    ],
    sitemap: [
      "https://totthobox.com/sitemap.xml",
    ],
  };
}
