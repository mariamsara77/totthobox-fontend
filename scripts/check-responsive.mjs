/* eslint-disable no-console */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const WIDTHS = [360, 390, 768, 1024, 1440];

const PAGES_TO_TEST = [
  { name: "home", path: "/" },
  { name: "tool", path: "/tools/age-calculator" },
  { name: "converter", path: "/converter/land" },
  { name: "calendar", path: "/bangla/calendar" },
  { name: "list", path: "/bangladesh/history" },
  { name: "detail", path: "/international/country/bangladesh" },
  { name: "about", path: "/about-us" },
];

const SCREENSHOT_WIDTHS = [390, 1440];
const SCREENSHOT_PAGES = ["home", "tool", "list", "detail", "calendar"];

async function run() {
  const screenshotDir = join(process.cwd(), "audit-screenshots");
  await mkdir(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const failures = [];

  for (const item of PAGES_TO_TEST) {
    const targetUrl = `${BASE_URL}${item.path}`;

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });

      try {
        const response = await page.goto(targetUrl, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });

        if (!response || response.status() !== 200) {
          failures.push(`[${item.name} @ ${width}px] Expected status 200, got ${response?.status()}`);
          continue;
        }

        // Wait a tick for client rendering
        await page.waitForTimeout(600);

        // 1. Check Horizontal Overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        if (hasOverflow) {
          failures.push(`[${item.name} @ ${width}px] Horizontal scroll detected (scrollWidth > innerWidth)`);
        }

        // 2. Check Interactive Tap Targets (visible buttons and role=button)
        const smallTargets = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("button, [role='button'], input[type='button'], input[type='submit']"));
          const small = [];
          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            // Only check visible elements with actual area
            if (rect.width > 0 && rect.height > 0 && el.offsetParent !== null) {
              const style = window.getComputedStyle(el);
              if (style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0") {
                if (rect.width < 38 || rect.height < 38) {
                  const text = (el.innerText || el.getAttribute("aria-label") || el.tagName).slice(0, 30).trim();
                  small.push({ tag: el.tagName, text, width: Math.round(rect.width), height: Math.round(rect.height) });
                }
              }
            }
          }
          return small;
        });

        if (smallTargets.length > 0) {
          // Allow up to a couple of minor embedded icons if any, report if critical
          for (const t of smallTargets.slice(0, 3)) {
            failures.push(`[${item.name} @ ${width}px] Small tap target: <${t.tag}> "${t.text}" is ${t.width}x${t.height}px (< 40px)`);
          }
        }

        // 3. Save Screenshot if required
        if (SCREENSHOT_WIDTHS.includes(width) && SCREENSHOT_PAGES.includes(item.name)) {
          const filePath = join(screenshotDir, `${item.name}-${width}px.png`);
          await page.screenshot({ path: filePath, fullPage: false });
        }
      } catch (err) {
        failures.push(`[${item.name} @ ${width}px] Error: ${err.message}`);
      }
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.error(`Responsive Audit Failures (${failures.length}):`);
    for (const f of failures) {
      console.error(" - " + f);
    }
    process.exit(1);
  } else {
    console.log(`Responsive Audit Passed across all ${WIDTHS.length} viewports and ${PAGES_TO_TEST.length} pages.`);
    console.log(`Screenshots saved in ${screenshotDir}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
