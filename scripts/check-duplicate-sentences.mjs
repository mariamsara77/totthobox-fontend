#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIRS = [
  path.join(__dirname, "..", "lib", "content", "tools"),
  path.join(__dirname, "..", "lib", "content", "converters"),
];

function extractSentences(text) {
  // Match string literals in ts content files
  const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;
  const strings = [];
  let match;
  while ((match = stringRegex.exec(text)) !== null) {
    const s = match[1] || match[2] || match[3] || "";
    // Only consider strings that contain Bengali characters
    if (/[\u0980-\u09FF]/.test(s) && s.length > 25) {
      strings.push(s);
    }
  }

  const allText = strings.join(" ");
  // Split on Bengali sentence terminators and punctuation
  const sentences = allText
    .split(/[।?!;\n]+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 20);

  return new Set(sentences);
}

function runCheck() {
  const files = [];

  for (const dir of CONTENT_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const e of entries) {
      if (e.endsWith(".ts")) {
        files.push({
          name: e.replace(".ts", ""),
          fullPath: path.join(dir, e),
        });
      }
    }
  }

  if (files.length === 0) {
    console.log("No content files found yet in lib/content/.");
    process.exit(0);
  }

  console.log(`Auditing sentence uniqueness across ${files.length} content files...`);

  const fileSentences = new Map();
  for (const f of files) {
    const raw = fs.readFileSync(f.fullPath, "utf8");
    const sentences = extractSentences(raw);
    fileSentences.set(f.name, sentences);
    console.log(`- ${f.name}: ${sentences.size} unique Bengali sentences`);
  }

  let failed = false;

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const nameA = files[i].name;
      const nameB = files[j].name;
      const setA = fileSentences.get(nameA);
      const setB = fileSentences.get(nameB);

      if (setA.size === 0 || setB.size === 0) continue;

      let commonCount = 0;
      for (const s of setA) {
        if (setB.has(s)) {
          commonCount++;
        }
      }

      const overlapRatio = commonCount / Math.min(setA.size, setB.size);
      if (overlapRatio > 0.1) {
        console.error(
          `❌ High sentence overlap between "${nameA}" and "${nameB}": ${(overlapRatio * 100).toFixed(1)}% (Threshold: 10%)`,
        );
        failed = true;
      }
    }
  }

  if (failed) {
    console.error("Duplicate sentence check failed!");
    process.exit(1);
  }

  console.log("✅ All content files passed uniqueness check (<10% overlap).");
}

runCheck();
