export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = "light" | "dark";

export type AccentId =
  | "indigo"
  | "blue"
  | "emerald"
  | "violet"
  | "teal"
  | "rose";

export type RadiusPreset = "sharp" | "medium" | "round";
export type DensityPreset = "comfortable" | "compact";
export type FontSizePreset = "sm" | "md" | "lg";
export type SidebarStyle = "expanded" | "rail" | "auto";

export interface AppearancePreferences {
  mode: ThemeMode;
  accent: AccentId;
  radius: RadiusPreset;
  density: DensityPreset;
  fontSize: FontSizePreset;
  reduceMotion: boolean;
  sidebarStyle: SidebarStyle;
}

export interface AccentOption {
  id: AccentId;
  labelBn: string;
  labelEn: string;
  swatch: string;
}

export const THEME_MODE_STORAGE_KEY = "totthobox-theme-mode";
export const ACCENT_STORAGE_KEY = "totthobox-accent";
export const RADIUS_STORAGE_KEY = "totthobox-radius";
export const DENSITY_STORAGE_KEY = "totthobox-density";
export const FONT_SIZE_STORAGE_KEY = "totthobox-font-size";
export const REDUCE_MOTION_STORAGE_KEY = "totthobox-reduce-motion";
export const SIDEBAR_STYLE_STORAGE_KEY = "totthobox-sidebar-style";

export const DEFAULT_THEME_MODE: ThemeMode = "light";
export const DEFAULT_ACCENT: AccentId = "emerald";
export const DEFAULT_RADIUS: RadiusPreset = "medium";
export const DEFAULT_DENSITY: DensityPreset = "comfortable";
export const DEFAULT_FONT_SIZE: FontSizePreset = "md";
export const DEFAULT_REDUCE_MOTION = false;
export const DEFAULT_SIDEBAR_STYLE: SidebarStyle = "auto";

export const DEFAULT_APPEARANCE: AppearancePreferences = {
  mode: DEFAULT_THEME_MODE,
  accent: DEFAULT_ACCENT,
  radius: DEFAULT_RADIUS,
  density: DEFAULT_DENSITY,
  fontSize: DEFAULT_FONT_SIZE,
  reduceMotion: DEFAULT_REDUCE_MOTION,
  sidebarStyle: DEFAULT_SIDEBAR_STYLE,
};

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

export const RADIUS_OPTIONS: ReadonlyArray<{
  id: RadiusPreset;
  label: string;
}> = [
  { id: "sharp", label: "তীক্ষ্ণ" },
  { id: "medium", label: "মাঝারি" },
  { id: "round", label: "গোলাকার" },
];

export const DENSITY_OPTIONS: ReadonlyArray<{
  id: DensityPreset;
  label: string;
}> = [
  { id: "comfortable", label: "আরামদায়ক" },
  { id: "compact", label: "সংক্ষিপ্ত" },
];

export const FONT_SIZE_OPTIONS: ReadonlyArray<{
  id: FontSizePreset;
  label: string;
  short: string;
}> = [
  { id: "sm", label: "ছোট (S)", short: "S" },
  { id: "md", label: "মাঝারি (M)", short: "M" },
  { id: "lg", label: "বড় (L)", short: "L" },
];

export const SIDEBAR_STYLE_OPTIONS: ReadonlyArray<{
  id: SidebarStyle;
  label: string;
}> = [
  { id: "expanded", label: "প্রসারিত" },
  { id: "rail", label: "আইকন রেল" },
  { id: "auto", label: "স্বয়ংক্রিয়" },
];

const VALID_MODES = new Set<string>(["light", "dark", "system"]);
const VALID_ACCENTS = new Set<string>(ACCENT_OPTIONS.map((a) => a.id));
const VALID_RADII = new Set<string>(["sharp", "medium", "round"]);
const VALID_DENSITIES = new Set<string>(["comfortable", "compact"]);
const VALID_FONT_SIZES = new Set<string>(["sm", "md", "lg"]);
const VALID_SIDEBAR_STYLES = new Set<string>(["expanded", "rail", "auto"]);

export function isValidThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && VALID_MODES.has(value);
}

export function isValidAccentId(value: unknown): value is AccentId {
  return typeof value === "string" && VALID_ACCENTS.has(value);
}

export function isValidRadiusPreset(value: unknown): value is RadiusPreset {
  return typeof value === "string" && VALID_RADII.has(value);
}

export function isValidDensityPreset(value: unknown): value is DensityPreset {
  return typeof value === "string" && VALID_DENSITIES.has(value);
}

export function isValidFontSizePreset(value: unknown): value is FontSizePreset {
  return typeof value === "string" && VALID_FONT_SIZES.has(value);
}

export function isValidSidebarStyle(value: unknown): value is SidebarStyle {
  return typeof value === "string" && VALID_SIDEBAR_STYLES.has(value);
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

export function resolveStoredRadius(raw: string | null): RadiusPreset {
  return isValidRadiusPreset(raw) ? raw : DEFAULT_RADIUS;
}

export function resolveStoredDensity(raw: string | null): DensityPreset {
  return isValidDensityPreset(raw) ? raw : DEFAULT_DENSITY;
}

export function resolveStoredFontSize(raw: string | null): FontSizePreset {
  return isValidFontSizePreset(raw) ? raw : DEFAULT_FONT_SIZE;
}

export function resolveStoredReduceMotion(raw: string | null): boolean {
  if (raw === "true") return true;
  if (raw === "false") return false;
  return DEFAULT_REDUCE_MOTION;
}

export function resolveStoredSidebarStyle(raw: string | null): SidebarStyle {
  return isValidSidebarStyle(raw) ? raw : DEFAULT_SIDEBAR_STYLE;
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
  prefs: Pick<
    AppearancePreferences,
    "mode" | "accent" | "radius" | "density" | "fontSize" | "reduceMotion" | "sidebarStyle"
  >,
): ResolvedThemeMode {
  const resolved = resolveEffectiveTheme(prefs.mode);
  if (typeof document === "undefined") return resolved;

  const root = document.documentElement;
  root.classList.remove("light", "dark", "reduce-motion");
  root.classList.add(resolved);
  if (prefs.reduceMotion) {
    root.classList.add("reduce-motion");
  }

  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-mode", prefs.mode);
  root.setAttribute("data-accent", prefs.accent);
  root.setAttribute("data-radius", prefs.radius);
  root.setAttribute("data-density", prefs.density);
  root.setAttribute("data-font-size", prefs.fontSize);
  root.setAttribute("data-reduce-motion", String(prefs.reduceMotion));
  root.setAttribute("data-sidebar-style", prefs.sidebarStyle);
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
 * system + default accent, and all custom preferences apply before first paint (zero FOUC).
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
    var r = localStorage.getItem('${RADIUS_STORAGE_KEY}');
    var radius = (r === 'sharp' || r === 'medium' || r === 'round') ? r : '${DEFAULT_RADIUS}';
    var d = localStorage.getItem('${DENSITY_STORAGE_KEY}');
    var density = (d === 'comfortable' || d === 'compact') ? d : '${DEFAULT_DENSITY}';
    var fs = localStorage.getItem('${FONT_SIZE_STORAGE_KEY}');
    var fontSize = (fs === 'sm' || fs === 'md' || fs === 'lg') ? fs : '${DEFAULT_FONT_SIZE}';
    var rm = localStorage.getItem('${REDUCE_MOTION_STORAGE_KEY}') === 'true';
    var ss = localStorage.getItem('${SIDEBAR_STYLE_STORAGE_KEY}');
    var sidebarStyle = (ss === 'expanded' || ss === 'rail' || ss === 'auto') ? ss : '${DEFAULT_SIDEBAR_STYLE}';
    var root = document.documentElement;
    root.classList.remove('light', 'dark', 'reduce-motion');
    root.classList.add(resolved);
    if (rm) root.classList.add('reduce-motion');
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-accent', accent);
    root.setAttribute('data-radius', radius);
    root.setAttribute('data-density', density);
    root.setAttribute('data-font-size', fontSize);
    root.setAttribute('data-reduce-motion', String(rm));
    root.setAttribute('data-sidebar-style', sidebarStyle);
    root.style.colorScheme = resolved;
    var colors = { light: '#ffffff', dark: '#141415' };
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', colors[resolved]);
  } catch (e) {}
})();
`;
