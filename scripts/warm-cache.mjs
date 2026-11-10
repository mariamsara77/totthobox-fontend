#!/usr/bin/env node

/**
 * Totthobox Production Cache Warmer
 * Crawls all URLs from /sitemap.xml with controlled concurrency and retries
 * to ensure all SSG/ISR pages are warm in cache immediately after deployment.
 *
 * Usage:
 *   node scripts/warm-cache.mjs [baseUrl]
 *   npm run warm
 */

const BASE_URL = process.argv[2] || process.env.SITE_URL || "https://totthobox.com";
const CONCURRENCY = 6;
const MAX_RETRIES = 2;
const TIMEOUT_MS = 15000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Totthobox-Cache-Warmer/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
      }).finally(() => clearTimeout(timer));

      const duration = Date.now() - start;
      const cacheStatus =
        res.headers.get("x-nextjs-cache") ||
        res.headers.get("cf-cache-status") ||
        "FETCHED";

      return {
        url,
        status: res.status,
        duration,
        cacheStatus,
        ok: res.ok,
      };
    } catch (err) {
      if (attempt === retries) {
        return {
          url,
          status: 0,
          duration: Date.now() - start,
          cacheStatus: "ERROR",
          ok: false,
          error: err.message,
        };
      }
      await sleep(1000 * (attempt + 1));
    }
  }
}

async function extractUrlsFromSitemap(baseUrl) {
  const sitemapUrl = `${baseUrl.replace(/\/$/, "")}/sitemap.xml`;
  console.log(`[WARM] Fetching sitemap from: ${sitemapUrl}`);

  try {
    const res = await fetch(sitemapUrl, {
      headers: { "User-Agent": "Totthobox-Cache-Warmer/1.0" },
    });

    if (!res.ok) {
      console.warn(`[WARM] Failed to fetch sitemap: HTTP ${res.status}. Falling back to default core URLs.`);
      return getDefaultUrls(baseUrl);
    }

    const xml = await res.text();
    const locMatches = xml.match(/<loc>([^<]+)<\/loc>/g);

    if (!locMatches || locMatches.length === 0) {
      console.warn(`[WARM] No <loc> tags found in sitemap. Falling back to default core URLs.`);
      return getDefaultUrls(baseUrl);
    }

    const urls = locMatches.map((m) => m.replace(/<\/?loc>/g, "").trim());
    return [...new Set(urls)];
  } catch (err) {
    console.warn(`[WARM] Error fetching sitemap: ${err.message}. Using default URLs.`);
    return getDefaultUrls(baseUrl);
  }
}

function getDefaultUrls(baseUrl) {
  const clean = baseUrl.replace(/\/$/, "");
  return [
    `${clean}/`,
    `${clean}/about-us`,
    `${clean}/editorial-policy`,
    `${clean}/privacy-policy`,
    `${clean}/contact-us`,
    `${clean}/disclaimer`,
    `${clean}/bangla/calendar`,
    `${clean}/bangla/holiday`,
    `${clean}/bangladesh/introduction`,
    `${clean}/bangladesh/history`,
    `${clean}/bangladesh/tourism`,
    `${clean}/bangladesh/establishment`,
    `${clean}/bangladesh/public-figure`,
    `${clean}/islam/basic`,
    `${clean}/islam/dowan`,
    `${clean}/converter/number-to-word`,
    `${clean}/converter/land`,
    `${clean}/converter/currency`,
    `${clean}/tools/image-resizer`,
    `${clean}/tools/age-calculator`,
    `${clean}/tools/percentage-calculator`,
    `${clean}/tools/tax-vat-calculator`,
    `${clean}/tools/internet-speed-test`,
    `${clean}/software/all`,
    `${clean}/signs/all`,
  ];
}

async function warmUrls(urls) {
  console.log(`[WARM] Starting cache warming for ${urls.length} URLs (Concurrency: ${CONCURRENCY})...\n`);
  const results = [];
  let index = 0;

  async function worker() {
    while (index < urls.length) {
      const i = index++;
      const url = urls[i];
      const res = await fetchWithRetry(url);
      results.push(res);
      const icon = res.ok ? "✓" : "✗";
      console.log(
        `[${String(i + 1).padStart(3)}/${urls.length}] ${icon} ${res.status} [${res.cacheStatus}] ${res.duration}ms - ${url}`
      );
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker());
  await Promise.all(workers);

  const successful = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  console.log(`\n================ Cache Warming Summary ================`);
  console.log(`Total URLs Processed : ${results.length}`);
  console.log(`Successful (HTTP 2xx): ${successful}`);
  console.log(`Failed / Errors      : ${failed}`);
  console.log(`=======================================================\n`);

  if (failed > 0 && failed / results.length > 0.15) {
    console.error(`[WARM] More than 15% of URLs failed to warm.`);
    process.exit(1);
  }
}

async function main() {
  const urls = await extractUrlsFromSitemap(BASE_URL);
  await warmUrls(urls);
}

main().catch((err) => {
  console.error(`[WARM] Fatal error:`, err);
  process.exit(1);
});
