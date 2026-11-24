import type { Metadata } from "next";

/**
 * Bangla & Multilingual Word Counter for SEO & Thin Content Guard
 * Strips HTML tags, URLs, email addresses, and splits on whitespace/punctuation.
 */
export function countWords(text: string | null | undefined): number {
  if (!text || typeof text !== "string") return 0;

  const cleaned = text
    // Remove HTML tags
    .replace(/<[^>]*>/g, " ")
    // Remove URLs
    .replace(/https?:\/\/\S+/gi, " ")
    // Remove Emails
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, " ")
    // Replace Bengali & English punctuation with space
    .replace(/[।।,;:!?"'()[\]{}/\\—\-_=+*&^%$#@~`|<>]/g, " ")
    // Normalize spaces
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return 0;
  return cleaned.split(" ").filter((w) => w.length > 0).length;
}

/**
 * Checks whether content is considered "thin" (< 300 words by default)
 */
export function isThinContent(
  text: string | null | undefined,
  minWords = 300,
): boolean {
  return countWords(text) < minWords;
}

/**
 * Returns SEO robots directive based on word count:
 * - Thin content (< 300 words) gets `noindex, follow` (crawlers follow links, no index penalty)
 * - Rich content (>= 300 words) gets `index, follow`
 */
export function getRobotsForContent(
  text: string | null | undefined,
  minWords = 300,
): NonNullable<Metadata["robots"]> {
  const thin = isThinContent(text, minWords);
  if (thin) {
    return {
      index: false,
      follow: true,
    };
  }
  return {
    index: true,
    follow: true,
  };
}

/**
 * Extracts combined text from a record or object across multiple fields
 */
export function extractRecordText(
  record: any,
  fields: string[] = [
    "title",
    "name",
    "details",
    "description",
    "content",
    "how_to_go",
    "best_time",
    "bio",
    "address",
    "bangla_text",
    "description_plain",
  ],
): string {
  if (!record || typeof record !== "object") return "";

  const parts: string[] = [];

  for (const field of fields) {
    const val = record[field];
    if (typeof val === "string" && val.trim()) {
      parts.push(val);
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === "string") {
          parts.push(item);
        } else if (item && typeof item === "object") {
          parts.push(extractRecordText(item, fields));
        }
      }
    }
  }

  return parts.join(" ");
}
