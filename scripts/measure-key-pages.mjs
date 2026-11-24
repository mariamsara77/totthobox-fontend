import { measurePageMetrics } from "./measure-perf.mjs";

const KEY_PAGES = [
  { name: "Home Page", route: "/" },
  { name: "News Portal", route: "/news/headlines" },
  { name: "Country / Encyclopedia", route: "/bangladesh/history" },
  { name: "Tool (Age Calculator)", route: "/tools/age-calculator" },
  { name: "Live TV", route: "/live-tv" },
];

async function run() {
  console.log("Measuring Core Web Vitals on Key Pages (Mobile 375x667)...\n");
  const results = [];

  for (const page of KEY_PAGES) {
    try {
      console.log(`Testing ${page.name} (${page.route})...`);
      const metrics = await measurePageMetrics(page.route);
      results.push({ ...page, ...metrics });
      console.log(`  ✓ Status: ${metrics.status} | LCP: ${metrics.lcp}ms | CLS: ${metrics.cls} | TBT: ${metrics.tbt}ms | TTFB: ${metrics.ttfb}ms | JS: ${metrics.jsSizeKb}KB`);
    } catch (err) {
      console.error(`  ✗ Error measuring ${page.route}:`, err.message);
    }
  }

  console.log("\n--- Summary Table ---");
  console.table(results.map(r => ({
    Page: r.name,
    Route: r.route,
    Status: r.status,
    "LCP (ms)": r.lcp,
    CLS: r.cls,
    "TBT (ms)": r.tbt,
    "TTFB (ms)": r.ttfb,
    "JS (KB)": r.jsSizeKb,
  })));
}

run().catch(console.error);
