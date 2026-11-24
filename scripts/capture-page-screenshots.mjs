import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3005";

const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "360", width: 360, height: 740 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
  { name: "844x390", width: 844, height: 390 }
];

const targetRoute = process.argv[2] || "/";
const pageName = process.argv[3] || "home";

const outputDir = resolve("test-results/audit-screenshots", pageName);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  console.log(`Capturing screenshots for ${targetRoute} (${pageName}) from ${BASE_URL}...`);
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}${targetRoute}`, { waitUntil: "networkidle", timeout: 30000 });
      // wait a tiny bit for layout rendering
      await page.waitForTimeout(500);

      const filePath = resolve(outputDir, `${pageName}-${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved: ${filePath}`);
    } catch (err) {
      console.error(`Error on ${vp.name}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
}

capture().catch(console.error);
