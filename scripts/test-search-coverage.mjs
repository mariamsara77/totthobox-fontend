#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

console.log("=== Testing Search Coverage & Architecture ===");

// 1. Test searchLocalCatalog
const { searchLocalCatalog } = await import("../lib/search/catalog.ts");

const testQueries = [
  { q: "বয়স", expectedTitle: "বয়স ক্যালকুলেটর", type: "Bangla query" },
  { q: "boyos", expectedTitle: "বয়স ক্যালকুলেটর", type: "Banglish query" },
  { q: "age", expectedTitle: "বয়স ক্যালকুলেটর", type: "English query" },
  { q: "জমি", expectedTitle: "জমি ও ক্ষেত্রফল পরিমাপ", type: "Bangla converter query" },
  { q: "jomi", expectedTitle: "জমি ও ক্ষেত্রফল পরিমাপ", type: "Banglish converter query" },
  { q: "land", expectedTitle: "জমি ও ক্ষেত্রফল পরিমাপ", type: "English converter query" },
  { q: "999", expectedTitle: "জাতীয় জরুরি সেবা ও হটলাইন", type: "Emergency hotline query" },
  { q: "emergency", expectedTitle: "জাতীয় জরুরি সেবা ও হটলাইন", type: "Emergency english query" },
  { q: "dollar", expectedTitle: "লাইভ মুদ্রা রূপান্তরকারী", type: "Currency query" },
  { q: "ছুটি", expectedTitle: "সরকারি ও ঐচ্ছিক ছুটির তালিকা", type: "Holiday query" },
  { q: "টুলস: বয়স", expectedTitle: "বয়স ক্যালকুলেটর", type: "Scoped prefix query" },
];

for (const test of testQueries) {
  const results = searchLocalCatalog(test.q, 5);
  assert(results.length > 0, `Search for "${test.q}" (${test.type}) should return results`);
  const match = results.find((r) => r._search_title.includes(test.expectedTitle));
  assert(
    match,
    `Search for "${test.q}" (${test.type}) should find "${test.expectedTitle}". Got: ${results.map((r) => r._search_title).join(", ")}`,
  );
  console.log(`✓ [${test.type}] "${test.q}" -> "${match._search_title}" (${match._search_url})`);
}

// 2. Test getSearchUrl
const { getSearchUrl } = await import("../lib/searchRoutes.ts");

const routeTests = [
  { item: { _search_title: "Cox", _search_type: "tourism", _search_slug: "coxs-bazar", _search_label: "", _search_url: "" }, expected: "/bangladesh/tourism/coxs-bazar" },
  { item: { _search_title: "Japan", _search_type: "country", _search_slug: "japan", _search_label: "", _search_url: "" }, expected: "/international/country/japan" },
  { item: { _search_title: "999", _search_type: "contact", _search_slug: "emergency", _search_label: "", _search_url: "" }, expected: "/contact/emergency" },
  { item: { _search_title: "Abs", _search_url: "https://totthobox.com/bangladesh/history/1971", _search_label: "" }, expected: "/bangladesh/history/1971" },
];

for (const test of routeTests) {
  const url = getSearchUrl(test.item);
  assert.equal(url, test.expected, `Expected getSearchUrl to return ${test.expected}, got ${url}`);
  console.log(`✓ [URL Mapping] ${test.item._search_type || "absolute"} -> "${url}"`);
}

// 3. Test robots noindex on app/(main)/search/page.tsx
const searchPageContent = fs.readFileSync(path.join(ROOT, "app/(main)/search/page.tsx"), "utf8");
assert(
  searchPageContent.includes("index: false") && searchPageContent.includes("follow: true"),
  "Search page MUST have robots: { index: false, follow: true }",
);
console.log("✓ [SEO] Search results page correctly marked with robots: { index: false, follow: true }");

// 4. Test WebSite SearchAction schema in SiteStructuredData.tsx
const structuredDataContent = fs.readFileSync(
  path.join(ROOT, "components/seo/SiteStructuredData.tsx"),
  "utf8",
);
assert(
  structuredDataContent.includes("https://totthobox.com/search?q={search_term_string}"),
  "WebSite schema must point SearchAction to https://totthobox.com/search?q={search_term_string}",
);
console.log("✓ [Schema] WebSite potentialAction: SearchAction correctly configured");

// 5. Test Global Ctrl+K in SearchModalContext.tsx
const searchModalContextContent = fs.readFileSync(
  path.join(ROOT, "context/SearchModalContext.tsx"),
  "utf8",
);
assert(
  searchModalContextContent.includes("e.ctrlKey || e.metaKey") &&
    searchModalContextContent.includes("e.key === \"k\""),
  "SearchModalContext must handle Ctrl+K and Cmd+K keyboard shortcuts",
);
console.log("✓ [Keyboard] Global Ctrl+K / Cmd+K listener registered");

console.log("\nALL SEARCH COVERAGE TESTS PASSED! (Exit 0)");
