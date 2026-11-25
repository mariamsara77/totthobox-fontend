export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = "light" | "dark";

export type AccentId =
  | "indigo"
  | "blue"
  | "emerald"
  | "violet"
  | "teal"
  | "rose";

export interface AccentOption {
  id: AccentId;
  labelBn: string;
  labelEn: string;
  swatch: string;
}

export const THEME_MODE_STORAGE_KEY = "totthobox-theme-mode";
export const ACCENT_STORAGE_KEY = "totthobox-accent";

export const DEFAULT_THEME_MODE: ThemeMode = "light";
export const DEFAULT_ACCENT: AccentId = "emerald";

export const THEME_COLOR_BY_MODE: Record<ResolvedThemeMode, string> = {
  light: "#ffffff",
  dark: "#141415",
};

export const THEME_MODE_OPTIONS: ReadonlyArray<{
  id: ThemeMode;
  label: string;
  description: string;
}> = [
  { id: "light", label: "লাইট", description: "পরিচ্ছন্ন উজ্জ্বল" },
  { id: "dark", label: "ডার্ক", description: "রাতের আরামদায়ক" },
  { id: "system", label: "সিস্টেম", description: "ডিভাইস অনুযায়ী" },
];

export const ACCENT_OPTIONS: ReadonlyArray<AccentOption> = [
  { id: "indigo", labelBn: "ইন্ডিগো", labelEn: "Indigo", swatch: "#4f46e5" },
  { id: "blue", labelBn: "নীল", labelEn: "Royal Blue", swatch: "#2563eb" },
  { id: "emerald", labelBn: "সবুজ", labelEn: "Emerald", swatch: "#059669" },
  { id: "violet", labelBn: "ভায়োলেট", labelEn: "Violet", swatch: "#7c3aed" },
  { id: "teal", labelBn: "টিল", labelEn: "Teal", swatch: "#0d9488" },
  { id: "rose", labelBn: "রোজ", labelEn: "Rose", swatch: "#e11d48" },
];

const VALID_MODES = new Set<string>(["light", "dark", "system"]);
const VALID_ACCENTS = new Set<string>(ACCENT_OPTIONS.map((a) => a.id));

export function isValidThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && VALID_MODES.has(value);
}

export function isValidAccentId(value: unknown): value is AccentId {
  return typeof value === "string" && VALID_ACCENTS.has(value);
}

/**
 * Safely migrate removed/unknown saved theme values (e.g. "sepia") to "system".
 * First-time visitors (null) start in DEFAULT_THEME_MODE ("light").
 */
export function resolveStoredThemeMode(raw: string | null): ThemeMode {
  if (raw === null) return DEFAULT_THEME_MODE;
  return isValidThemeMode(raw) ? raw : "system";
}

/**
 * Safely migrate removed/unknown saved accent values (e.g. "amber", "crimson", "terracotta")
 * to DEFAULT_ACCENT.
 */
export function resolveStoredAccentId(raw: string | null): AccentId {
  if (raw === null) return DEFAULT_ACCENT;
  return isValidAccentId(raw) ? raw : DEFAULT_ACCENT;
}

export function resolveEffectiveTheme(mode: ThemeMode): ResolvedThemeMode {
  if (mode === "dark") return "dark";
  if (mode === "light") return "light";
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function applyAppearanceToDocument(
  mode: ThemeMode,
  accent: AccentId,
): ResolvedThemeMode {
  const resolved = resolveEffectiveTheme(mode);
  if (typeof document === "undefined") return resolved;

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-mode", mode);
  root.setAttribute("data-accent", accent);
  root.style.colorScheme = resolved;

  const themeColor = THEME_COLOR_BY_MODE[resolved];
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = themeColor;
  return resolved;
}

/**
 * Blocking inline script for <head> so first-time visitors start in Light Mode,
 * removed/unknown saved values (sepia/amber/terracotta) silently migrate to
 * system + default accent, and returning visitors see zero FOUC or hydration mismatch.
 */
export const APPEARANCE_INIT_SCRIPT = `
(function() {
  try {
    var m = localStorage.getItem('${THEME_MODE_STORAGE_KEY}');
    var mode = (m === null) ? '${DEFAULT_THEME_MODE}' : ((m === 'light' || m === 'dark' || m === 'system') ? m : 'system');
    var resolved = (mode === 'system')
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    var a = localStorage.getItem('${ACCENT_STORAGE_KEY}');
    var validAccents = ['indigo','blue','emerald','violet','teal','rose'];
    var accent = validAccents.indexOf(a) !== -1 ? a : '${DEFAULT_ACCENT}';
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-accent', accent);
    root.style.colorScheme = resolved;
    var colors = { light: '#ffffff', dark: '#141415' };
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', colors[resolved]);
  } catch (e) {}
})();
`;
