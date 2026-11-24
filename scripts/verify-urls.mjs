import http from "node:http";

const urls = [
  "/international/country/bangladesh",
  "/international/country/france",
  "/converter/land",
  "/tools/percentage-calculator",
  "/converter/number-to-word",
  "/bangla/holiday/english-new-year",
  "/bangla/calendar",
  "/software/bijoy-bayanno",
  "/software/kalpurush-bangla-font",
  "/bangladesh/establishment/baitul-mukarram-national-mosque",
  "/signs/emergency/emergency-stop"
];

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

function fetchHtml(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    }).on("error", reject);
  });
}

async function run() {
  let allPass = true;
  for (const path of urls) {
    const res = await fetchHtml(path);
    if (res.status !== 200) {
      console.error(`FAIL [${res.status}]: ${path}`);
      allPass = false;
      continue;
    }
    const h1Matches = res.body.match(/<h1[\s\S]*?<\/h1>/gi) || [];
    const scriptRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let jsonLdValid = true;
    let jsonLdCount = 0;
    let match;
    while ((match = scriptRegex.exec(res.body)) !== null) {
      jsonLdCount++;
      try {
        JSON.parse(match[1]);
      } catch (err) {
        jsonLdValid = false;
        console.error(`Invalid JSON-LD on ${path}: ${err.message}`);
      }
    }
    console.log(`PASS: ${path} | status: ${res.status} | H1 count: ${h1Matches.length} | JSON-LD blocks: ${jsonLdCount} (valid: ${jsonLdValid})`);
    if (h1Matches.length !== 1 || !jsonLdValid) {
      allPass = false;
    }
  }
  if (!allPass) {
    process.exit(1);
  } else {
    console.log("\nALL URL VERIFICATIONS PASSED!");
  }
}

run();
