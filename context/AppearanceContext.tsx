"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ACCENT_STORAGE_KEY,
  applyAppearanceToDocument,
  DEFAULT_APPEARANCE,
  DENSITY_STORAGE_KEY,
  FONT_SIZE_STORAGE_KEY,
  RADIUS_STORAGE_KEY,
  REDUCE_MOTION_STORAGE_KEY,
  resolveEffectiveTheme,
  resolveStoredAccentId,
  resolveStoredDensity,
  resolveStoredFontSize,
  resolveStoredRadius,
  resolveStoredReduceMotion,
  resolveStoredSidebarStyle,
  resolveStoredThemeMode,
  SIDEBAR_STYLE_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  type AccentId,
  type AppearancePreferences,
  type DensityPreset,
  type FontSizePreset,
  type RadiusPreset,
  type ResolvedThemeMode,
  type SidebarStyle,
  type ThemeMode,
} from "@/lib/appearance";

interface AppearanceContextValue extends AppearancePreferences {
  resolvedMode: ResolvedThemeMode;
  mounted: boolean;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentId) => void;
  setRadius: (radius: RadiusPreset) => void;
  setDensity: (density: DensityPreset) => void;
  setFontSize: (fontSize: FontSizePreset) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  setSidebarStyle: (sidebarStyle: SidebarStyle) => void;
  resetAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function safeSetStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AppearancePreferences>(DEFAULT_APPEARANCE);
  const [resolvedMode, setResolvedMode] = useState<ResolvedThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let loaded: AppearancePreferences = { ...DEFAULT_APPEARANCE };

    try {
      const rawMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
      const mode = resolveStoredThemeMode(rawMode);
      if (rawMode !== null && mode !== rawMode) {
        safeSetStorage(THEME_MODE_STORAGE_KEY, mode);
      }

      const rawAccent = window.localStorage.getItem(ACCENT_STORAGE_KEY);
      const accent = resolveStoredAccentId(rawAccent);
      if (rawAccent !== null && accent !== rawAccent) {
        safeSetStorage(ACCENT_STORAGE_KEY, accent);
      }

      const radius = resolveStoredRadius(
        window.localStorage.getItem(RADIUS_STORAGE_KEY),
      );
      const density = resolveStoredDensity(
        window.localStorage.getItem(DENSITY_STORAGE_KEY),
      );
      const fontSize = resolveStoredFontSize(
        window.localStorage.getItem(FONT_SIZE_STORAGE_KEY),
      );
      const rawReduce = window.localStorage.getItem(REDUCE_MOTION_STORAGE_KEY);
      const reduceMotion =
        rawReduce !== null
          ? resolveStoredReduceMotion(rawReduce)
          : typeof window.matchMedia === "function" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sidebarStyle = resolveStoredSidebarStyle(
        window.localStorage.getItem(SIDEBAR_STYLE_STORAGE_KEY),
      );

      loaded = {
        mode,
        accent,
        radius,
        density,
        fontSize,
        reduceMotion,
        sidebarStyle,
      };
    } catch {
      // Ignore storage errors in restricted contexts
    }

    setPrefs(loaded);
    setResolvedMode(applyAppearanceToDocument(loaded));
    setMounted(true);

    const handleStorage = (event: StorageEvent) => {
      setPrefs((prev) => {
        const next = { ...prev };
        if (event.key === THEME_MODE_STORAGE_KEY) {
          next.mode = resolveStoredThemeMode(event.newValue);
        } else if (event.key === ACCENT_STORAGE_KEY) {
          next.accent = resolveStoredAccentId(event.newValue);
        } else if (event.key === RADIUS_STORAGE_KEY) {
          next.radius = resolveStoredRadius(event.newValue);
        } else if (event.key === DENSITY_STORAGE_KEY) {
          next.density = resolveStoredDensity(event.newValue);
        } else if (event.key === FONT_SIZE_STORAGE_KEY) {
          next.fontSize = resolveStoredFontSize(event.newValue);
        } else if (event.key === REDUCE_MOTION_STORAGE_KEY) {
          next.reduceMotion = resolveStoredReduceMotion(event.newValue);
        } else if (event.key === SIDEBAR_STYLE_STORAGE_KEY) {
          next.sidebarStyle = resolveStoredSidebarStyle(event.newValue);
        } else {
          return prev;
        }
        setResolvedMode(applyAppearanceToDocument(next));
        return next;
      });
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (
      !mounted ||
      prefs.mode !== "system" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedMode(applyAppearanceToDocument(prefs));
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [mounted, prefs]);

  const updatePref = useCallback(
    <K extends keyof AppearancePreferences>(
      key: K,
      storageKey: string,
      value: AppearancePreferences[K],
    ) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        setResolvedMode(applyAppearanceToDocument(next));
        return next;
      });
      safeSetStorage(storageKey, String(value));
    },
    [],
  );

  const setMode = useCallback(
    (mode: ThemeMode) => updatePref("mode", THEME_MODE_STORAGE_KEY, mode),
    [updatePref],
  );
  const setAccent = useCallback(
    (accent: AccentId) =>
      updatePref("accent", ACCENT_STORAGE_KEY, accent),
    [updatePref],
  );
  const setRadius = useCallback(
    (radius: RadiusPreset) =>
      updatePref("radius", RADIUS_STORAGE_KEY, radius),
    [updatePref],
  );
  const setDensity = useCallback(
    (density: DensityPreset) =>
      updatePref("density", DENSITY_STORAGE_KEY, density),
    [updatePref],
  );
  const setFontSize = useCallback(
    (fontSize: FontSizePreset) =>
      updatePref("fontSize", FONT_SIZE_STORAGE_KEY, fontSize),
    [updatePref],
  );
  const setReduceMotion = useCallback(
    (reduceMotion: boolean) =>
      updatePref("reduceMotion", REDUCE_MOTION_STORAGE_KEY, reduceMotion),
    [updatePref],
  );
  const setSidebarStyle = useCallback(
    (sidebarStyle: SidebarStyle) =>
      updatePref("sidebarStyle", SIDEBAR_STYLE_STORAGE_KEY, sidebarStyle),
    [updatePref],
  );

  const resetAppearance = useCallback(() => {
    setPrefs(DEFAULT_APPEARANCE);
    setResolvedMode(resolveEffectiveTheme(DEFAULT_APPEARANCE.mode));
    applyAppearanceToDocument(DEFAULT_APPEARANCE);
    safeSetStorage(THEME_MODE_STORAGE_KEY, DEFAULT_APPEARANCE.mode);
    safeSetStorage(ACCENT_STORAGE_KEY, DEFAULT_APPEARANCE.accent);
    safeSetStorage(RADIUS_STORAGE_KEY, DEFAULT_APPEARANCE.radius);
    safeSetStorage(DENSITY_STORAGE_KEY, DEFAULT_APPEARANCE.density);
    safeSetStorage(FONT_SIZE_STORAGE_KEY, DEFAULT_APPEARANCE.fontSize);
    safeSetStorage(
      REDUCE_MOTION_STORAGE_KEY,
      String(DEFAULT_APPEARANCE.reduceMotion),
    );
    safeSetStorage(
      SIDEBAR_STYLE_STORAGE_KEY,
      DEFAULT_APPEARANCE.sidebarStyle,
    );
  }, []);

  return (
    <AppearanceContext.Provider
      value={{
        ...prefs,
        resolvedMode,
        mounted,
        setMode,
        setAccent,
        setRadius,
        setDensity,
        setFontSize,
        setReduceMotion,
        setSidebarStyle,
        resetAppearance,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return ctx;
}
