import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function getFiles(dir, match) {
  let results = [];
  try {
    const list = readdirSync(dir);
    for (const file of list) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (file === "node_modules" || file === ".next" || file === "public") continue;
        results = results.concat(getFiles(fullPath, match));
      } else if (match.test(fullPath)) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    console.warn("Scan warning:", e.message);
  }
  return results;
}

const componentFiles = [
  ...getFiles("components", /\.(tsx|jsx)$/),
  ...getFiles("app", /\.(tsx|jsx)$/),
];

console.log(`Auditing design token compliance across ${componentFiles.length} files (components + app)...`);

const ARBITRARY_PATTERN = /(?:text|w|h|p|m|gap|rounded)-\[\d+px\]/g;
let violationCount = 0;
const violations = [];

for (const file of componentFiles) {
  const code = readFileSync(file, "utf8");
  const matches = [...code.matchAll(ARBITRARY_PATTERN)];
  if (matches.length > 0) {
    violationCount += matches.length;
    violations.push({
      file: file.replace(/\\/g, "/"),
      matches: matches.map(m => m[0])
    });
  }
}

if (violations.length > 0) {
  console.warn(`\n⚠️ Found ${violationCount} arbitrary Tailwind pixel values in UI components:`);
  for (const v of violations) {
    console.warn(`  - ${v.file}: ${v.matches.join(", ")}`);
  }
  console.warn("\nPlease replace arbitrary values with standardized Tailwind design tokens (e.g. text-xs, text-sm, h-9, size-5).\n");
} else {
  console.log(`\n✅ DESIGN TOKENS COMPLIANCE PASSED: 0 arbitrary pixel values in core UI components.\n`);
}
