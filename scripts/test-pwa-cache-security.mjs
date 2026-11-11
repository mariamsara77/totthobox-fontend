import assert from "node:assert/strict";
import vm from "node:vm";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const config = await readFile("next.config.ts", "utf8");
const worker = await readFile("public/sw.js", "utf8");
const cleanupSource = await readFile("public/sw-cache-cleanup.js", "utf8");
const rootLayout = await readFile("app/layout.tsx", "utf8");
const tagManager = await readFile("components/partials/TagManager.tsx", "utf8");
const adSenseLoader = await readFile("components/DeferredAdSense.tsx", "utf8");
const adUnit = await readFile("components/AdUnit.tsx", "utf8");

assert.match(config, /extendDefaultRuntimeCaching:\s*false/);
assert.match(config, /cacheOnFrontEndNav:\s*false/);
assert.match(config, /aggressiveFrontEndNavCaching:\s*false/);
assert.match(config, /cacheStartUrl:\s*false/);
assert.match(config, /dynamicStartUrl:\s*false/);
assert.match(config, /public-document-pages-v3/);
assert.match(config, /Next-Router-Prefetch/);
assert.match(config, /cacheControl\.includes\("public"\)/);
assert.match(config, /"private", "no-store", "no-cache"/);
assert.match(config, /vary\.includes\("\*"\)/);
assert.match(config, /"cookie", "authorization"/);
assert.match(config, /response\.status !== 200/);
assert.match(config, /response\.type !== "basic"/);
assert.match(config, /importScripts: \["\/sw-cache-cleanup\.js"\]/);

assert.match(worker, /public-document-pages-v3/);
assert.match(worker, /Next-Router-Prefetch/);
assert.match(worker, /sw-cache-cleanup\.js/);
assert.match(worker, /\/offline/);
assert.doesNotMatch(worker, /pages-rsc-prefetch|pages-rsc|static-data-assets/);

// Simulate worker activation and ensure only known legacy dynamic caches are removed.
const cacheNames = new Set([
  "pages",
  "pages-rsc",
  "pages-rsc-prefetch",
  "start-url",
  "next-data",
  "static-data-assets",
  "apis",
  "cross-origin",
  "next-image",
  "static-image-assets",
  "static-audio-assets",
  "static-video-assets",
  "public-document-pages-v2",
  "public-image-font-assets-v1",
  "public-document-pages-v3",
  "workbox-precache-v2-previous-build",
  "app-owned-cache",
]);

let activateHandler;
const deleted = [];
const self = {
  addEventListener(type, handler) {
    if (type === "activate") activateHandler = handler;
  },
};
const caches = {
  async keys() {
    return [...cacheNames];
  },
  async delete(name) {
    deleted.push(name);
    return cacheNames.delete(name);
  },
};

vm.runInNewContext(cleanupSource, { self, caches, Promise });
assert.equal(typeof activateHandler, "function");

let activation;
activateHandler({
  waitUntil(promise) {
    activation = promise;
  },
});
await activation;

for (const name of [
  "pages",
  "pages-rsc",
  "pages-rsc-prefetch",
  "start-url",
  "next-data",
  "static-data-assets",
  "apis",
  "cross-origin",
  "next-image",
  "static-image-assets",
  "static-audio-assets",
  "static-video-assets",
  "public-document-pages-v2",
  "public-image-font-assets-v1",
]) {
  assert.equal(cacheNames.has(name), false, "legacy cache survived cleanup: " + name);
}

assert.equal(cacheNames.has("public-document-pages-v3"), true);
assert.equal(cacheNames.has("workbox-precache-v2-previous-build"), true);
assert.equal(cacheNames.has("app-owned-cache"), true);
assert.equal(deleted.length, 14);

assert.ok(rootLayout.includes('process.env.ADSENSE_ENABLED === "true"'));
assert.ok(rootLayout.includes('process.env.ADSENSE_CMP_READY === "true"'));
assert.ok(rootLayout.includes("NEXT_PUBLIC_ADSENSE_CLIENT"));
assert.ok(rootLayout.includes("<DeferredAdSense enabled={ADSENSE_ENABLED}"));
assert.ok(!rootLayout.includes("ca-pub-9522604367420521"));

assert.ok(adSenseLoader.includes("if (!enabled || !clientId) return"));
assert.ok(adSenseLoader.includes("if (hasMarketingConsent()) loadAdSense(clientId)"));
assert.ok(adSenseLoader.includes("pagead2.googlesyndication.com"));

assert.ok(tagManager.includes("if (analytics) {"));
assert.ok(tagManager.includes("loadGoogleAnalytics();"));
assert.ok(tagManager.includes("loadGoogleTagManager();"));
assert.ok(!tagManager.includes("if (analytics || marketing) loadGoogleTagManager();"));
assert.ok(tagManager.includes('analytics_storage: analytics ? "granted" : "denied"'));

assert.ok(adUnit.includes("if (!canRender || adBlocked) return null;"));
assert.ok(adUnit.includes("{marketingConsent && ("));

process.stdout.write("PWA cache-security checks passed.\n");

const adsTxtDir = await mkdtemp(join(tmpdir(), "totthobox-ads-txt-"));
const adsTxtOutput = join(adsTxtDir, "ads.txt");
const generatorPath = fileURLToPath(
  new URL("./generate-ads-txt.mjs", import.meta.url),
);
const realPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";

async function runAdsTxtGenerator(overrides) {
  const result = spawnSync(process.execPath, [generatorPath, adsTxtOutput], {
    encoding: "utf8",
    env: { ...process.env, ...overrides },
  });
  assert.equal(
    result.status,
    0,
    result.stderr || result.stdout || "ads.txt generator failed",
  );
  return readFile(adsTxtOutput, "utf8");
}

try {
  const disabledAdsTxt = await runAdsTxtGenerator({
    ADSENSE_ENABLED: "false",
    ADSENSE_CMP_READY: "true",
    NEXT_PUBLIC_ADSENSE_CLIENT: realPublisherId,
  });
  assert.doesNotMatch(disabledAdsTxt, /google\.com, pub-/);

  const cmpNotReadyAdsTxt = await runAdsTxtGenerator({
    ADSENSE_ENABLED: "true",
    ADSENSE_CMP_READY: "false",
    NEXT_PUBLIC_ADSENSE_CLIENT: realPublisherId,
  });
  assert.doesNotMatch(cmpNotReadyAdsTxt, /google\.com, pub-/);

  const missingPublisherAdsTxt = await runAdsTxtGenerator({
    ADSENSE_ENABLED: "true",
    ADSENSE_CMP_READY: "true",
    NEXT_PUBLIC_ADSENSE_CLIENT: "",
  });
  assert.doesNotMatch(missingPublisherAdsTxt, /google\.com, pub-/);

  if (/^ca-pub-\d{16}$/.test(realPublisherId)) {
    const enabledAdsTxt = await runAdsTxtGenerator({
      ADSENSE_ENABLED: "true",
      ADSENSE_CMP_READY: "true",
      NEXT_PUBLIC_ADSENSE_CLIENT: realPublisherId,
    });
    const expectedSellerLine =
      "google.com, pub-" +
      realPublisherId.slice("ca-pub-".length) +
      ", DIRECT, f08c47fec0942fa0";
    assert.ok(enabledAdsTxt.includes(expectedSellerLine));
  }
} finally {
  await rm(adsTxtDir, { recursive: true, force: true });
}

process.stdout.write("AdSense env and ads.txt checks passed.\n");
