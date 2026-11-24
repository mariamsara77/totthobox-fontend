#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIRS = [
  { dir: path.join(__dirname, "..", "lib", "content", "tools"), type: "Tool" },
  { dir: path.join(__dirname, "..", "lib", "content", "converters"), type: "Converter" },
  { dir: path.join(__dirname, "..", "lib", "content", "sections"), type: "Section" },
];

function countBengaliWords(text) {
  // Extract all strings
  const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;
  const strings = [];
  let match;
  while ((match = stringRegex.exec(text)) !== null) {
    const s = match[1] || match[2] || match[3] || "";
    if (/[\u0980-\u09FF]/.test(s)) {
      strings.push(s);
    }
  }
  const combined = strings.join(" ");
  const words = combined
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && /[\u0980-\u09FF]/.test(w));
  return words.length;
}

const results = [];

for (const { dir, type } of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const wordCount = countBengaliWords(content);
    results.push({
      name: file.replace(".ts", ""),
      type,
      wordCount,
      targetMet: wordCount >= 500 ? "✅" : "⚠️",
    });
  }
}

console.warn(`Total Content Files: ${results.length}`);
console.warn(
  "| # | Name | Type | Bengali Words | Status |"
);
console.warn(
  "|---|------|------|---------------|--------|"
);
results.forEach((r, idx) => {
  console.warn(
    `| ${idx + 1} | ${r.name} | ${r.type} | ~${r.wordCount} words | ${r.targetMet} |`
  );
});
