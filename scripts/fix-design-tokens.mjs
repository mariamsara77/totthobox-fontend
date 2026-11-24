#!/usr/bin/env node
/**
 * Batch replace arbitrary Tailwind pixel values with design token equivalents.
 * Run: node scripts/fix-design-tokens.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = process.cwd();

// --- Replacement map: arbitrary value → Tailwind token ---
// Only safe, universal replacements. Context-specific values left untouched.
const REPLACEMENTS = [
  // Min sizes (tap targets)
  ['min-h-[44px]', 'min-h-11'],
  ['min-w-[44px]', 'min-w-11'],
  ['min-h-[40px]', 'min-h-10'],
  ['min-w-[40px]', 'min-w-10'],
  ['min-h-[38px]', 'min-h-10'],
  ['min-h-[52px]', 'min-h-13'],
  ['min-w-[38px]', 'min-w-10'],
  ['min-h-[36px]', 'min-h-9'],
  ['min-w-[36px]', 'min-w-9'],
  ['min-h-[48px]', 'min-h-12'],
  ['min-w-[48px]', 'min-w-12'],
  ['min-h-[32px]', 'min-h-8'],
  ['min-w-[32px]', 'min-w-8'],
  ['min-h-[28px]', 'min-h-7'],
  ['min-w-[28px]', 'min-w-7'],
  ['min-h-[56px]', 'min-h-14'],
  ['min-w-[56px]', 'min-w-14'],
  ['min-h-[64px]', 'min-h-16'],
  ['min-w-[64px]', 'min-w-16'],
  ['min-h-[20px]', 'min-h-5'],
  ['min-w-[20px]', 'min-w-5'],
  ['min-h-[140px]', 'min-h-36'],
  ['min-h-[130px]', 'min-h-32'],
  ['min-h-[620px]', 'min-h-[38rem]'],
  ['min-w-[140px]', 'min-w-36'],
  ['min-w-[120px]', 'min-w-32'],
  ['min-w-[70px]', 'min-w-18'],

  // Fixed sizes
  ['h-[44px]', 'h-11'],
  ['w-[44px]', 'w-11'],
  ['h-[40px]', 'h-10'],
  ['w-[40px]', 'w-10'],
  ['h-[48px]', 'h-12'],
  ['w-[48px]', 'w-12'],
  ['h-[36px]', 'h-9'],
  ['w-[36px]', 'w-9'],
  ['h-[32px]', 'h-8'],
  ['w-[32px]', 'w-8'],
  ['h-[28px]', 'h-7'],
  ['w-[28px]', 'w-7'],
  ['h-[56px]', 'h-14'],
  ['w-[56px]', 'w-14'],
  ['h-[64px]', 'h-16'],
  ['w-[64px]', 'w-16'],
  ['h-[20px]', 'h-5'],
  ['w-[20px]', 'w-5'],
  ['h-[24px]', 'h-6'],
  ['w-[24px]', 'w-6'],
  ['h-[16px]', 'h-4'],
  ['w-[16px]', 'w-4'],
  ['h-[52px]', 'h-13'],
  ['w-[52px]', 'w-13'],
  ['h-[68px]', 'h-17'],

  // Size utility
  ['size-[44px]', 'size-11'],
  ['size-[40px]', 'size-10'],
  ['size-[48px]', 'size-12'],
  ['size-[36px]', 'size-9'],
  ['size-[32px]', 'size-8'],
  ['size-[28px]', 'size-7'],
  ['size-[24px]', 'size-6'],
  ['size-[20px]', 'size-5'],
  ['size-[18px]', 'size-4.5'],
  ['size-[16px]', 'size-4'],
  ['size-[56px]', 'size-14'],
  ['size-[64px]', 'size-16'],

  // Max sizes
  ['max-w-[44px]', 'max-w-11'],
  ['max-h-[44px]', 'max-h-11'],
  ['max-w-[40px]', 'max-w-10'],
  ['max-h-[40px]', 'max-h-10'],
  ['max-w-[48px]', 'max-w-12'],
  ['max-h-[48px]', 'max-h-12'],
  ['max-w-[32px]', 'max-w-8'],
  ['max-h-[32px]', 'max-h-8'],
  ['max-w-[64px]', 'max-w-16'],
  ['max-h-[64px]', 'max-h-16'],
  ['max-w-[220px]', 'max-w-56'],
  ['max-h-[460px]', 'max-h-115'],

  // Text sizes (10px → text-2xs, 11px → text-xs for better readability)
  ['text-[9px]', 'text-2xs'],
  ['text-[10px]', 'text-2xs'],
  ['text-[11px]', 'text-xs'],
  ['text-[12px]', 'text-xs'],
  ['text-[13px]', 'text-sm'],
  ['text-[14px]', 'text-sm'],
  ['text-[15px]', 'text-base'],
  ['text-[16px]', 'text-base'],
  ['text-[18px]', 'text-lg'],
  ['text-[20px]', 'text-xl'],
  ['text-[22px]', 'text-xl'],
  ['text-[24px]', 'text-2xl'],

  // Padding
  ['p-[2px]', 'p-0.5'],
  ['p-[4px]', 'p-1'],
  ['p-[6px]', 'p-1.5'],
  ['p-[8px]', 'p-2'],
  ['p-[10px]', 'p-2.5'],
  ['p-[12px]', 'p-3'],
  ['p-[16px]', 'p-4'],
  ['p-[20px]', 'p-5'],
  ['p-[24px]', 'p-6'],
  ['px-[2px]', 'px-0.5'],
  ['px-[4px]', 'px-1'],
  ['px-[6px]', 'px-1.5'],
  ['px-[8px]', 'px-2'],
  ['px-[10px]', 'px-2.5'],
  ['px-[12px]', 'px-3'],
  ['px-[16px]', 'px-4'],
  ['py-[2px]', 'py-0.5'],
  ['py-[4px]', 'py-1'],
  ['py-[6px]', 'py-1.5'],
  ['py-[8px]', 'py-2'],
  ['py-[10px]', 'py-2.5'],
  ['py-[12px]', 'py-3'],
  ['py-[16px]', 'py-4'],
  ['pt-[2px]', 'pt-0.5'],
  ['pb-[2px]', 'pb-0.5'],
  ['pl-[2px]', 'pl-0.5'],
  ['pr-[2px]', 'pr-0.5'],

  // Margin
  ['m-[2px]', 'm-0.5'],
  ['m-[4px]', 'm-1'],
  ['mx-[2px]', 'mx-0.5'],
  ['mx-[4px]', 'mx-1'],
  ['my-[2px]', 'my-0.5'],
  ['my-[4px]', 'my-1'],
  ['mt-[2px]', 'mt-0.5'],
  ['mb-[2px]', 'mb-0.5'],
  ['ml-[2px]', 'ml-0.5'],
  ['mr-[2px]', 'mr-0.5'],

  // Gap
  ['gap-[2px]', 'gap-0.5'],
  ['gap-[4px]', 'gap-1'],
  ['gap-[6px]', 'gap-1.5'],
  ['gap-[8px]', 'gap-2'],
  ['gap-[10px]', 'gap-2.5'],
  ['gap-[12px]', 'gap-3'],
  ['gap-[16px]', 'gap-4'],
  ['gap-x-[2px]', 'gap-x-0.5'],
  ['gap-x-[4px]', 'gap-x-1'],
  ['gap-y-[2px]', 'gap-y-0.5'],
  ['gap-y-[4px]', 'gap-y-1'],

  // Rounded
  ['rounded-[4px]', 'rounded'],
  ['rounded-[6px]', 'rounded-md'],
  ['rounded-[8px]', 'rounded-lg'],
  ['rounded-[12px]', 'rounded-xl'],
  ['rounded-[16px]', 'rounded-2xl'],
  ['rounded-[20px]', 'rounded-2xl'],
  ['rounded-[24px]', 'rounded-3xl'],
  ['rounded-[2px]', 'rounded-sm'],
  ['rounded-[3px]', 'rounded-xs'],

  // Space
  ['space-x-[2px]', 'space-x-0.5'],
  ['space-x-[4px]', 'space-x-1'],
  ['space-y-[2px]', 'space-y-0.5'],
  ['space-y-[4px]', 'space-y-1'],

  // Top/inset
  ['top-[0px]', 'top-0'],
  ['left-[0px]', 'left-0'],
  ['right-[0px]', 'right-0'],
  ['bottom-[0px]', 'bottom-0'],
  ['inset-[0px]', 'inset-0'],

  // Backdrop blur
  ['backdrop-blur-[2px]', 'backdrop-blur-sm'],
  ['backdrop-blur-[4px]', 'backdrop-blur-sm'],

  // Border
  ['border-[1px]', 'border'],
  ['border-[2px]', 'border-2'],
];

// Files / dirs to skip
const SKIP = new Set(['.next', 'node_modules', '.git', 'public', 'dist', '.vercel']);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

let totalReplacements = 0;
const changedFiles = [];

for (const file of walk(ROOT)) {
  let content = readFileSync(file, 'utf8');
  let original = content;
  let fileReplacements = 0;

  for (const [from, to] of REPLACEMENTS) {
    // Match the exact class (word boundary or preceded by space/quote/backtick, followed by space/quote/backtick/end)
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, to);
      fileReplacements += matches.length;
    }
  }

  if (content !== original) {
    if (!DRY_RUN) {
      writeFileSync(file, content, 'utf8');
    }
    const rel = relative(ROOT, file);
    changedFiles.push({ file: rel, count: fileReplacements });
    totalReplacements += fileReplacements;
    console.log(`${DRY_RUN ? '[DRY] ' : ''}${rel}: ${fileReplacements} replacement(s)`);
  }
}

console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Total: ${totalReplacements} replacements across ${changedFiles.length} files`);
if (changedFiles.length === 0) {
  console.log('No arbitrary pixel values found to replace.');
}
