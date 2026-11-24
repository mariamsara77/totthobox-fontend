import assert from "node:assert/strict";
import { NAVIGATION_REGISTRY, ALL_NAV_ITEMS } from "../config/navigation.ts";

console.log("Auditing config/navigation.ts registry...");

const hrefSeen = new Map();
const idSeen = new Map();
const labelSeen = new Map();
const errors = [];

for (const item of ALL_NAV_ITEMS) {
  // 1. Check duplicate href
  if (hrefSeen.has(item.href)) {
    errors.push(
      `DUPLICATE HREF DETECTED: "${item.href}" is used by both "${hrefSeen.get(item.href)}" and "${item.label}" (id: ${item.id})`
    );
  } else {
    hrefSeen.set(item.href, item.label);
  }

  // 2. Check duplicate id
  if (idSeen.has(item.id)) {
    errors.push(
      `DUPLICATE ID DETECTED: "${item.id}" is used by both "${idSeen.get(item.id)}" and "${item.label}"`
    );
  } else {
    idSeen.set(item.id, item.label);
  }

  // 3. Check duplicate label
  if (labelSeen.has(item.label)) {
    errors.push(
      `DUPLICATE LABEL DETECTED: Label "${item.label}" is used multiple times (ids: ${labelSeen.get(item.label)}, ${item.id})`
    );
  } else {
    labelSeen.set(item.label, item.id);
  }

  // 4. Validate href format
  if (!item.href.startsWith("/")) {
    errors.push(`INVALID HREF FORMAT: "${item.href}" must start with "/"`);
  }

  // 5. Check sensitive categories have ads disabled and noindex
  if (item.category === "media" || item.href === "/live-tv" || item.href.startsWith("/news")) {
    if (item.adsEnabled !== false) {
      errors.push(`POLICY VIOLATION: "${item.href}" in media/news must have adsEnabled = false`);
    }
    if (item.indexable !== false) {
      errors.push(`POLICY VIOLATION: "${item.href}" in media/news must have indexable = false`);
    }
  }
}

console.log(`Total Categories Audited: ${NAVIGATION_REGISTRY.length}`);
console.log(`Total Navigation Items Audited: ${ALL_NAV_ITEMS.length}`);

if (errors.length > 0) {
  console.error("\n❌ NAVIGATION REGISTRY VALIDATION FAILED WITH ERRORS:");
  for (const err of errors) {
    console.error("  -", err);
  }
  process.exit(1);
} else {
  console.log("\n✅ NAVIGATION REGISTRY VALIDATION PASSED (0 duplicate hrefs, 0 duplicate ids, policy guards active).\n");
}
