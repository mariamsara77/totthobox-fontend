import { chromium } from "playwright";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3005";

export async function measurePageMetrics(route) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Track JS scripts downloaded and their sizes
  let totalJsBytes = 0;
  page.on("response", async (res) => {
    const url = res.url();
    if (url.endsWith(".js") || url.includes("/_next/static/chunks/")) {
      try {
        const buffer = await res.body();
        totalJsBytes += buffer.length;
      } catch {}
    }
  });

  const url = `${BASE_URL}${route}`;
  const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });

  // Extract Web Vitals via browser API
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      let lcp = 0;
      let cls = 0;
      let tbt = 0;

      // 1. LCP observer
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) lcp = lastEntry.startTime;
      });
      try {
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {}

      // 2. CLS observer
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
      });
      try {
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch {}

      // 3. Long tasks for TBT
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          tbt += entry.duration - 50;
        }
      });
      try {
        longTaskObserver.observe({ type: "longtask", buffered: true });
      } catch {}

      // Navigation timing for TTFB
      setTimeout(() => {
        const navEntries = performance.getEntriesByType("navigation");
        const nav = navEntries && navEntries[0] ? navEntries[0] : null;
        const ttfb = nav ? nav.responseStart - nav.requestStart : 0;
        resolve({
          lcp: Math.round(lcp || (nav ? nav.domContentLoadedEventEnd : 0)),
          cls: Number(cls.toFixed(4)),
          tbt: Math.round(tbt),
          ttfb: Math.round(ttfb),
        });
      }, 500);
    });
  });

  await browser.close();

  return {
    route,
    status: response ? response.status() : 0,
    lcp: metrics.lcp,
    cls: metrics.cls,
    tbt: metrics.tbt,
    ttfb: metrics.ttfb,
    jsSizeKb: Math.round(totalJsBytes / 1024),
  };
}

if (process.argv[1] && process.argv[1].endsWith("measure-perf.mjs")) {
  measurePageMetrics("/").then((res) => {
    console.log("Sample Measurement for /:", res);
  }).catch(e => console.error(e));
}
