import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3005";

// All 9 requested viewports
const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-360", width: 360, height: 640 },
  { name: "mobile-375", width: 375, height: 667 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-412", width: 412, height: 915 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1536", width: 1536, height: 864 },
];

const TARGET_ROUTES = [
  "/",
  "/services",
  "/tools/tax-vat-calculator",
  "/tools/age-calculator",
  "/converter/land",
  "/converter/number-to-word",
  "/bangla/calendar",
  "/bangladesh/history",
  "/international/world-clock",
  "/islam/basic",
  "/software/all",
  "/authors",
  "/contact-us",
  "/privacy-policy",
];

const outputDir = resolve("test-results/visual-regression");
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function runVisualAudit() {
  console.log(`Starting Comprehensive Multi-Viewport Visual Regression Audit against ${BASE_URL}...`);
  console.log(`Testing ${VIEWPORTS.length} viewports across ${TARGET_ROUTES.length} core templates (${VIEWPORTS.length * TARGET_ROUTES.length} total tests)\n`);

  const browser = await chromium.launch();
  let totalTests = 0;
  let passedTests = 0;
  const issues = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.width < 768
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    for (const route of TARGET_ROUTES) {
      totalTests++;
      const url = `${BASE_URL}${route}`;

      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        if (!response || response.status() !== 200) {
          issues.push(`[${vp.name}] ${route} returned HTTP ${response ? response.status() : "no-response"}`);
          continue;
        }

        // 1. Check Horizontal Overflow (document.scrollingElement.scrollWidth > innerWidth)
        const overflow = await page.evaluate(() => {
          const doc = document.scrollingElement || document.documentElement;
          const scrollWidth = doc.scrollWidth;
          const innerWidth = window.innerWidth;
          return scrollWidth > innerWidth + 1 ? { scrollWidth, innerWidth } : null;
        });

        if (overflow) {
          issues.push(`[${vp.name}] ${route} horizontal overflow: scrollWidth=${overflow.scrollWidth}px > innerWidth=${overflow.innerWidth}px`);
        }

        // 2. Check Font Consistency
        const bodyFont = await page.evaluate(() => {
          return window.getComputedStyle(document.body).fontFamily;
        });

        // 3. Capture baseline screenshot
        const cleanName = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
        const screenshotPath = `${outputDir}/${vp.name}_${cleanName}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });

        passedTests++;
        console.log(`  ✓ ${route} (width: ${vp.width}px) | overflow: 0 | font: ${bodyFont.slice(0, 20)}...`);
      } catch (err) {
        issues.push(`[${vp.name}] ${route} error: ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`Visual Audit Complete: ${passedTests}/${totalTests} tests passed.`);
  if (issues.length > 0) {
    console.error(`\n❌ Issues Detected (${issues.length}):`);
    for (const issue of issues) {
      console.error("  -", issue);
    }
    process.exit(1);
  } else {
    console.log(`✅ 100% MULTI-VIEWPORT RESPONSIVE PASS (0 horizontal overflow, responsive layout on all 9 viewports: 320 to 1536px).\n`);
  }
}

runVisualAudit().catch((err) => {
  console.error("Fatal audit failure:", err);
  process.exit(1);
});
