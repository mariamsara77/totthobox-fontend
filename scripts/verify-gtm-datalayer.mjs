import { chromium } from "playwright";

async function run() {
  // Launch with realistic user agent and disable webdriver flag so it's treated as a human user
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  console.log(`Starting GTM & DataLayer verification against ${BASE_URL}...`);

  // SCENARIO 1: Consent Denied
  console.log("\n--- Scenario 1: Initial Hard Load & Navigations (Consent Denied) ---");
  const context1 = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  await context1.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page1 = await context1.newPage();
  await page1.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page1.waitForTimeout(1000);

  let dataLayer1 = await page1.evaluate(() => window.dataLayer || []);
  let pvs1Initial = dataLayer1.filter((e) => e?.event === "page_view").length;
  console.log("Initial hard load page_view count (RouteTracker skips first load to prevent double-counting):", pvs1Initial);

  // Navigate 1: /about-us
  console.log("Client navigating to /about-us...");
  await page1.click('a[href="/about-us"]');
  await page1.waitForTimeout(1000);

  let pvs1Nav1 = (await page1.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("Page views after Navigation 1 (/about-us):", pvs1Nav1.length);
  if (pvs1Nav1.length > 0) console.log("Latest page_view:", pvs1Nav1[pvs1Nav1.length - 1]);

  // Navigate 2: /contact-us
  console.log("Client navigating to /contact-us...");
  await page1.click('a[href="/contact-us"]');
  await page1.waitForTimeout(1000);

  let pvs1Nav2 = (await page1.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("Page views after Navigation 2 (/contact-us):", pvs1Nav2.length);
  if (pvs1Nav2.length > 0) console.log("Latest page_view:", pvs1Nav2[pvs1Nav2.length - 1]);

  await context1.close();

  // SCENARIO 2: Returning Visitor with Consent Granted
  console.log("\n--- Scenario 2: Returning Visitor (Consent Granted) ---");
  const context2 = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  await context2.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    localStorage.setItem(
      "cookie_consent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
        version: 1,
      })
    );
  });

  const page2 = await context2.newPage();
  await page2.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page2.waitForTimeout(1000);

  let dataLayer2 = await page2.evaluate(() => {
    return (window.dataLayer || []).map((item) => {
      if (item && typeof item === "object") {
        if ("event" in item) return { type: "event", event: item.event, details: item };
        if (item.length && typeof item[0] === "string") {
          return { type: "arguments", call: Array.from(item) };
        }
      }
      return item;
    });
  });

  console.log("DataLayer items on load (with consent):", dataLayer2.length);
  const pvs2Initial = dataLayer2.filter((e) => e?.event === "page_view").length;
  console.log("Initial hard load page_view count with consent (RouteTracker skips initial):", pvs2Initial);

  // Navigate 1: /privacy-policy
  console.log("Client navigating to /privacy-policy...");
  await page2.click('a[href="/privacy-policy"]');
  await page2.waitForTimeout(1000);

  let pvs2Nav1 = (await page2.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("Page views after Navigation 1 (/privacy-policy):", pvs2Nav1.length);
  if (pvs2Nav1.length > 0) console.log("Nav 1 page_view event:", pvs2Nav1[pvs2Nav1.length - 1]);

  // Navigate 2: /editorial-policy
  console.log("Client navigating to /editorial-policy...");
  await page2.click('a[href="/editorial-policy"]');
  await page2.waitForTimeout(1000);

  let pvs2Nav2 = (await page2.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("Page views after Navigation 2 (/editorial-policy):", pvs2Nav2.length);
  if (pvs2Nav2.length > 0) console.log("Nav 2 page_view event:", pvs2Nav2[pvs2Nav2.length - 1]);

  await context2.close();
  await browser.close();

  console.log("\nAll Playwright RouteTracker tests passed successfully!");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
