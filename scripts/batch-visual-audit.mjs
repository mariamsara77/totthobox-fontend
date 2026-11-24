import { chromium } from "playwright";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3005";

const VIEWPORTS = [
  { name: "360", width: 360, height: 740 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

const PAGES_TO_AUDIT = [
  { name: "Home", route: "/" },
  { name: "Services", route: "/services" },
  { name: "Age Calculator", route: "/tools/age-calculator" },
  { name: "Tax Calculator", route: "/tools/tax-vat-calculator" },
  { name: "Image Resizer", route: "/tools/image-resizer" },
  { name: "Password Generator", route: "/tools/password-generator" },
  { name: "Speed Test", route: "/tools/internet-speed-test" },
  { name: "Word Counter", route: "/tools/word-and-character-counter" },
  { name: "Percentage Calculator", route: "/tools/percentage-calculator" },
  { name: "QR Generator", route: "/tools/qrcode-generator" },
  { name: "Writing Practice", route: "/tools/writing-practice" },
  { name: "Zodiac Calculator", route: "/tools/zodiac-calculator" },
  { name: "Land Converter", route: "/converter/land" },
  { name: "Currency Converter", route: "/converter/currency" },
  { name: "Number to Word", route: "/converter/number-to-word" },
  { name: "Bangla Calendar", route: "/bangla/calendar" },
  { name: "Bangla Holidays", route: "/bangla/holiday" },
  { name: "Holiday Detail (Short)", route: "/bangla/holiday/english-new-year" },
  { name: "Holiday Detail (Long)", route: "/bangla/holiday/saraswati-puja" },
  { name: "BD History", route: "/bangladesh/history" },
  { name: "BD Establishment", route: "/bangladesh/establishment" },
  { name: "Establishment (Short)", route: "/bangladesh/establishment/tara-masjid" },
  { name: "Establishment (Long)", route: "/bangladesh/establishment/baitul-mukarram-national-mosque" },
  { name: "BD Tourism", route: "/bangladesh/tourism" },
  { name: "BD Public Figure", route: "/bangladesh/public-figure" },
  { name: "World Clock", route: "/international/world-clock" },
  { name: "Calling Codes", route: "/international/calling-codes" },
  { name: "Islam Basic", route: "/islam/basic" },
  { name: "Islam Dua (Short)", route: "/islam/dowan/dua-tauba" },
  { name: "Islam Dua (Long)", route: "/islam/dowan/dua-hifazat" },
  { name: "Software All", route: "/software/all" },
  { name: "Software Platform", route: "/software/all/Windows" },
  { name: "Software Detail", route: "/software/vlc-media-player" },
  { name: "Signs All", route: "/signs/all" },
  { name: "Signs Category", route: "/signs/emergency" },
  { name: "News Home", route: "/news" },
  { name: "News Headlines", route: "/news/headlines" },
  { name: "Live TV", route: "/live-tv" },
  { name: "About Us", route: "/about-us" },
  { name: "Authors", route: "/authors" },
  { name: "Privacy Policy", route: "/privacy-policy" },
  { name: "Terms of Service", route: "/terms-of-service" },
  { name: "Offline Fallback", route: "/offline" },
  { name: "Login", route: "/login" },
  { name: "Register", route: "/register" },
  { name: "Settings Profile", route: "/settings/profile" },
  { name: "404 Not Found", route: "/non-existent-page-404" },
];

const results = [];

async function run() {
  console.log(`Starting Batch Visual Audit of ${PAGES_TO_AUDIT.length} pages across ${VIEWPORTS.length} viewports...`);
  const browser = await chromium.launch();

  for (const p of PAGES_TO_AUDIT) {
    const row = {
      name: p.name,
      route: p.route,
      scores: {},
      issues: [],
      verdict: "PASS"
    };

    console.log(`Auditing: ${p.name} (${p.route})...`);

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      try {
        const res = await page.goto(`${BASE_URL}${p.route}`, {
          waitUntil: "domcontentloaded",
          timeout: 20000,
        });

        await page.waitForTimeout(400);

        const check = await page.evaluate((vpWidth) => {
          const doc = document.scrollingElement || document.documentElement;
          const body = document.body;
          const scrollWidth = doc.scrollWidth;
          const bodyWidth = body.clientWidth;
          const hasOverflow = scrollWidth > vpWidth + 1;

          function isInsideScrollContainer(element) {
            let parent = element.parentElement;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const style = window.getComputedStyle(parent);
              if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
                return true;
              }
              parent = parent.parentElement;
            }
            return false;
          }

          // Check if any unconstrained block element spills outside viewport
          let wideCount = 0;
          let widestTag = "";
          let maxW = 0;
          document.querySelectorAll("main, section, article, div, table, header, footer").forEach((el) => {
            if (isInsideScrollContainer(el)) return;
            const rect = el.getBoundingClientRect();
            if (rect.width > vpWidth + 2) {
              wideCount++;
              if (rect.width > maxW) {
                maxW = rect.width;
                widestTag = el.tagName + (el.className ? "." + el.className.slice(0, 30) : "");
              }
            }
          });

          return {
            hasOverflow,
            scrollWidth,
            wideCount,
            widestTag,
            maxW,
          };
        }, vp.width);

        if (check.hasOverflow || check.wideCount > 0) {
          row.scores[vp.name] = "FAIL";
          row.verdict = "FAIL";
          row.issues.push(`${vp.name}px: ${check.wideCount} elements exceed viewport (max ${Math.round(check.maxW)}px by ${check.widestTag})`);
        } else {
          row.scores[vp.name] = "PASS";
        }
      } catch (err) {
        row.scores[vp.name] = "ERR";
        row.verdict = "FAIL";
        row.issues.push(`${vp.name}px: ${err.message}`);
      } finally {
        await context.close();
      }
    }

    if (row.issues.length === 0) {
      row.issues.push("Zero horizontal overflow, perfectly bounded layout");
    }

    results.push(row);
  }

  await browser.close();

  console.log("\n================ AUDIT SUMMARY ================");
  let passCount = 0;
  for (const r of results) {
    console.log(`${r.verdict === "PASS" ? "✅" : "❌"} [${r.verdict}] ${r.name} (${r.route}): 360:${r.scores["360"]} | 390:${r.scores["390"]} | 768:${r.scores["768"]} | 1024:${r.scores["1024"]} | 1440:${r.scores["1440"]}`);
    if (r.verdict === "PASS") passCount++;
  }
  console.log(`\nTotal: ${passCount} / ${results.length} PASS`);

  writeFileSync("test-results/page-inventory-results.json", JSON.stringify(results, null, 2));
}

run().catch(console.error);
