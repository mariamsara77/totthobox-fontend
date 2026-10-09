export type ContactSidebarCategory = {
  id?: string | number;
  slug: string;
  name: string;
};

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * The existing Laravel endpoint normally returns a direct array. Also accept
 * common JSON envelopes without hiding categories based on potentially
 * inconsistent legacy status flags.
 */
export function normalizeContactCategories(value: unknown): ContactSidebarCategory[] {
  let candidate: unknown = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(candidate)) break;
    if (!isRecord(candidate)) return [];

    const next = [candidate.data, candidate.categories, candidate.items, candidate.results]
      .find((entry) => entry !== undefined && entry !== null);

    if (next === undefined) return [];
    candidate = next;
  }

  if (!Array.isArray(candidate)) return [];

  const seen = new Set<string>();
  return candidate.flatMap((entry) => {
    if (!isRecord(entry)) return [];

    const slug = typeof entry.slug === "string" ? entry.slug.trim() : "";
    const nameValue = typeof entry.name === "string"
      ? entry.name
      : typeof entry.title === "string"
        ? entry.title
        : typeof entry.label === "string"
          ? entry.label
          : "";
    const name = nameValue.trim();

    if (!slug || !name || seen.has(slug)) return [];
    seen.add(slug);

    return [{
      ...(typeof entry.id === "string" || typeof entry.id === "number" ? { id: entry.id } : {}),
      slug,
      name,
    }];
  });
}
