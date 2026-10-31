import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const config = await readFile("next.config.ts", "utf8");
const worker = await readFile("public/sw.js", "utf8");
const cleanupSource = await readFile("public/sw-cache-cleanup.js", "utf8");

// The generated worker must not inherit the plugin's broad default caches.
assert.match(config, /extendDefaultRuntimeCaching:\s*false/);
assert.match(config, /cacheOnFrontEndNav:\s*false/);
assert.match(config, /aggressiveFrontEndNavCaching:\s*false/);
assert.match(config, /cacheStartUrl:\s*false/);
assert.match(config, /dynamicStartUrl:\s*false/);
assert.match(worker, /public-document-pages-v3/);
assert.doesNotMatch(worker, /publicDocumentPath/);
assert.match(worker, /Next-Router-Prefetch/);
assert.match(worker, /sw-cache-cleanup\.js/);
assert.equal((worker.match(/NetworkOnly/g) ?? []).length, 3);
assert.equal((worker.match(/NetworkFirst/g) ?? []).length, 1);
assert.match(config, /request\.mode === "navigate"/);
assert.match(config, /url\.search === ""/);
assert.match(config, /url\.search !== ""/);
assert.match(config, /request\.headers\.get\("RSC"\)/);
assert.match(config, /Next-Router-Prefetch/);
assert.match(config, /request\.headers\.has\("authorization"\)/);
assert.match(config, /cacheControl\.includes\("public"\)/);
assert.match(config, /"private", "no-store", "no-cache"/);
assert.match(config, /vary\.includes\("\*"\)/);
assert.match(config, /"cookie", "authorization"/);
assert.match(config, /response\.status !== 200/);
assert.match(config, /response\.type !== "basic"/);
assert.match(worker, /precacheAndRoute/);
assert.match(worker, /cache-control/);
assert.match(worker, /no-store/);
assert.match(worker, /private/);
assert.match(worker, /vary/);
assert.match(worker, /\/offline/);
assert.doesNotMatch(worker, /pages-rsc-prefetch|pages-rsc|static-data-assets/);
assert.doesNotMatch(worker, /cacheName:"pages"|cacheName:"apis"|cacheName:"cross-origin"/);
assert.doesNotMatch(worker, /workbox_strategies_CacheFirst/);

// Exercise activation cleanup with risky legacy caches and caches that must survive.
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
  assert.equal(cacheNames.has(name), false, "legacy cache was not removed: " + name);
}
assert.equal(cacheNames.has("public-document-pages-v3"), true);
assert.equal(cacheNames.has("workbox-precache-v2-previous-build"), true);
assert.equal(cacheNames.has("app-owned-cache"), true);
assert.equal(deleted.length, 14);

process.stdout.write("PWA cache-security checks passed.\n");
