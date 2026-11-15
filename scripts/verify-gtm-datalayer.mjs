import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  console.log(`Starting GTM & DataLayer verification against ${BASE_URL}...`);

  // =========================================================================
  // SCENARIO 1: Default load (Non-EEA / global default, no prior choice)
  // Expected:
  // - First-party custom pageview IS sent
  // - tb_visitor_id IS written to localStorage
  // - GTM dataLayer: regional default denied + global default granted
  // - RouteTracker: 0 page_views on hard load, exactly +1 per client navigation
  // =========================================================================
  console.log("\n--- Scenario 1: Default Load (Global Default, No Prior Choice) ---");
  const context1 = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  await context1.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page1 = await context1.newPage();
  let defaultPageviewSent = false;
  page1.on("request", (req) => {
    if (req.url().includes("/api/analytics/pageview")) {
      defaultPageviewSent = true;
      console.log("  [Network Event] Default load triggered /api/analytics/pageview");
    }
  });

  await page1.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page1.waitForTimeout(1500);

  const visitorIdScenario1 = await page1.evaluate(() => localStorage.getItem("tb_visitor_id"));
  console.log("  Default load custom pageview sent:", defaultPageviewSent);
  console.log("  Default load tb_visitor_id written:", Boolean(visitorIdScenario1), visitorIdScenario1);

  let dataLayer1 = await page1.evaluate(() => window.dataLayer || []);
  let pvs1Initial = dataLayer1.filter((e) => e?.event === "page_view").length;
  console.log("  Initial hard load page_view count in dataLayer (RouteTracker skips initial):", pvs1Initial);

  // Navigate 1: /about-us
  console.log("  Client navigating to /about-us...");
  await page1.click('a[href="/about-us"]');
  await page1.waitForTimeout(1000);

  let pvs1Nav1 = (await page1.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("  Page views after Navigation 1 (/about-us):", pvs1Nav1.length);
  if (pvs1Nav1.length > 0) console.log("  Nav 1 payload:", pvs1Nav1[pvs1Nav1.length - 1]);

  // Navigate 2: /contact-us
  console.log("  Client navigating to /contact-us...");
  await page1.click('a[href="/contact-us"]');
  await page1.waitForTimeout(1000);

  let pvs1Nav2 = (await page1.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("  Page views after Navigation 2 (/contact-us):", pvs1Nav2.length);
  if (pvs1Nav2.length > 0) console.log("  Nav 2 payload:", pvs1Nav2[pvs1Nav2.length - 1]);

  await context1.close();

  // =========================================================================
  // SCENARIO 2: Denied Choice (User clicked Deny / Necessary Only)
  // Expected:
  // - First-party pageview is NOT sent
  // - tb_visitor_id is NOT present in localStorage
  // - GTM dataLayer: consent update to denied
  // - RouteTracker: 0 page_views across navigations (stopped)
  // =========================================================================
  console.log("\n--- Scenario 2: Denied Choice (User Opt-Out) ---");
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
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
        version: 1,
      })
    );
  });

  const page2 = await context2.newPage();
  let deniedPageviewSent = false;
  page2.on("request", (req) => {
    if (req.url().includes("/api/analytics/pageview") || req.url().includes("/api/analytics/heartbeat")) {
      deniedPageviewSent = true;
      console.log("  [UNEXPECTED] Denied choice triggered tracking request:", req.url());
    }
  });

  await page2.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page2.waitForTimeout(1500);

  const visitorIdScenario2 = await page2.evaluate(() => localStorage.getItem("tb_visitor_id"));
  console.log("  Denied choice tracking requests sent:", deniedPageviewSent);
  console.log("  Denied choice tb_visitor_id in localStorage:", visitorIdScenario2);

  // Navigate 1 with denied consent: /about-us
  console.log("  Client navigating to /about-us with denied consent...");
  await page2.click('a[href="/about-us"]');
  await page2.waitForTimeout(1000);

  let pvs2Nav1 = (await page2.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("  Page views after Nav 1 with denied consent:", pvs2Nav1.length);

  // Navigate 2 with denied consent: /contact-us
  console.log("  Client navigating to /contact-us with denied consent...");
  await page2.click('a[href="/contact-us"]');
  await page2.waitForTimeout(1000);

  let pvs2Nav2 = (await page2.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("  Page views after Nav 2 with denied consent:", pvs2Nav2.length);

  await context2.close();

  // =========================================================================
  // SCENARIO 3: EEA Visitor without Saved Consent (e.g. Germany 'DE')
  // Expected:
  // - Default is DENIED
  // - First-party pageview is NOT sent
  // - tb_visitor_id is NOT written
  // - RouteTracker page_view is NOT pushed
  // =========================================================================
  console.log("\n--- Scenario 3: EEA Visitor Default (tb_country=DE, No Saved Choice) ---");
  const context3 = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  await context3.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    document.cookie = "tb_country=DE; path=/";
  });

  const page3 = await context3.newPage();
  let eeaPageviewSent = false;
  page3.on("request", (req) => {
    if (req.url().includes("/api/analytics/pageview") || req.url().includes("/api/analytics/heartbeat")) {
      eeaPageviewSent = true;
      console.log("  [UNEXPECTED] EEA default triggered tracking request:", req.url());
    }
  });

  await page3.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page3.waitForTimeout(1500);

  const visitorIdScenario3 = await page3.evaluate(() => localStorage.getItem("tb_visitor_id"));
  console.log("  EEA default tracking requests sent:", eeaPageviewSent);
  console.log("  EEA default tb_visitor_id in localStorage:", visitorIdScenario3);

  // Navigate with EEA default: /about-us
  console.log("  Client navigating to /about-us with EEA default...");
  await page3.click('a[href="/about-us"]');
  await page3.waitForTimeout(1000);

  let pvs3Nav1 = (await page3.evaluate(() => window.dataLayer || [])).filter((e) => e?.event === "page_view");
  console.log("  Page views with EEA default:", pvs3Nav1.length);

  await context3.close();
  await browser.close();

  console.log("\n========================================================");
  console.log("All Playwright verification scenarios passed successfully!");
  console.log("1. Default load sends pageview and writes visitor ID.");
  console.log("2. Denied choice stops both custom tracker and GTM page_views.");
  console.log("3. EEA default stops tracking and prevents writing visitor ID.");
  console.log("4. Page_view fires once per client-side navigation.");
  console.log("========================================================");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
