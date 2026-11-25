/* eslint-disable no-console */
import http from "node:http";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

const SAMPLE_ROUTES = [
  "/",
  "/about-us",
  "/privacy-policy",
  "/disclaimer",
  "/editorial-policy",
  "/services",
  "/bangla/calendar",
  "/bangla/holiday",
  "/tools/tax-vat-calculator",
  "/tools/age-calculator",
  "/converter/land",
  "/converter/number-to-word",
  "/international/all-country",
  "/international/calling-codes",
  "/international/country/bangladesh",
  "/islam/basic",
  "/islam/dowan",
  "/sitemap.xml",
  "/robots.txt",
];

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on("error", reject);
  });
}

async function run() {
  const failures = [];
  let checkedCount = 0;

  for (const route of SAMPLE_ROUTES) {
    const fullUrl = `${BASE_URL}${route}`;
    checkedCount++;

    try {
      const res = await fetchPage(fullUrl);

      if (res.status !== 200) {
        failures.push(`[${route}] Expected status 200, got ${res.status}`);
        continue;
      }

      if (route === "/sitemap.xml") {
        if (!res.body.includes("<urlset") && !res.body.includes("<sitemapindex")) {
          failures.push(`[${route}] Missing valid XML sitemap root element`);
        }
        continue;
      }

      if (route === "/robots.txt") {
        if (!/User-agent/i.test(res.body) || !/Sitemap/i.test(res.body)) {
          failures.push(`[${route}] Missing User-agent or Sitemap line in robots.txt`);
        }
        continue;
      }

      const html = res.body;

      // 1. Exactly one <h1>
      const h1Matches = html.match(/<h1[\s>]/gi) || [];
      if (h1Matches.length !== 1) {
        failures.push(`[${route}] Expected exactly one <h1>, found ${h1Matches.length}`);
      }

      // 2. Title exists
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "";
      if (!title) {
        failures.push(`[${route}] Missing <title> tag`);
      }

      // 3. Description exists
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
      const desc = descMatch ? descMatch[1].trim() : "";
      if (!desc) {
        failures.push(`[${route}] Missing meta description`);
      }

      // 4. Canonical link exists and no tracking query params
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
                             html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";
      if (!canonical) {
        failures.push(`[${route}] Missing canonical link`);
      } else if (/[?&](utm_|gclid|fbclid)/i.test(canonical)) {
        failures.push(`[${route}] Canonical link contains tracking query params: ${canonical}`);
      }

      // 5. No keywords meta
      const keywordsMatch = html.match(/<meta[^>]+name=["']keywords["']/i);
      if (keywordsMatch) {
        failures.push(`[${route}] Forbidden meta keywords tag found`);
      }

      // 6. JSON-LD scripts must be valid JSON
      const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      while ((match = jsonLdRegex.exec(html)) !== null) {
        try {
          JSON.parse(match[1]);
        } catch (e) {
          failures.push(`[${route}] Invalid JSON-LD block: ${e.message}`);
        }
      }
    } catch (err) {
      failures.push(`[${route}] Fetch error: ${err.message}`);
    }
  }

  if (failures.length > 0) {
    console.error("SEO Audit Failures:");
    for (const f of failures) {
      console.error(" - " + f);
    }
    process.exit(1);
  } else {
    console.log(`All SEO checks passed (${checkedCount} pages verified, 0 failures).`);
  }
}

run();
