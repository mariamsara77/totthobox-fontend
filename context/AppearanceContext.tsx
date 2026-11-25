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
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  resolveEffectiveTheme,
  resolveStoredAccentId,
  resolveStoredThemeMode,
  THEME_MODE_STORAGE_KEY,
  type AccentId,
  type ResolvedThemeMode,
  type ThemeMode,
} from "@/lib/appearance";

interface AppearanceContextValue {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  accent: AccentId;
  mounted: boolean;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentId) => void;
  resetAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [resolvedMode, setResolvedMode] = useState<ResolvedThemeMode>("light");
  const [accent, setAccentState] = useState<AccentId>(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initialMode: ThemeMode = DEFAULT_THEME_MODE;
    let initialAccent: AccentId = DEFAULT_ACCENT;

    try {
      const rawMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
      initialMode = resolveStoredThemeMode(rawMode);
      if (rawMode !== null && initialMode !== rawMode) {
        window.localStorage.setItem(THEME_MODE_STORAGE_KEY, initialMode);
      }

      const rawAccent = window.localStorage.getItem(ACCENT_STORAGE_KEY);
      initialAccent = resolveStoredAccentId(rawAccent);
      if (rawAccent !== null && initialAccent !== rawAccent) {
        window.localStorage.setItem(ACCENT_STORAGE_KEY, initialAccent);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    setModeState(initialMode);
    setAccentState(initialAccent);
    setResolvedMode(applyAppearanceToDocument(initialMode, initialAccent));
    setMounted(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_MODE_STORAGE_KEY) {
        const nextMode = resolveStoredThemeMode(event.newValue);
        setModeState(nextMode);
        setResolvedMode(applyAppearanceToDocument(nextMode, initialAccent));
      }
      if (event.key === ACCENT_STORAGE_KEY) {
        const nextAccent = resolveStoredAccentId(event.newValue);
        setAccentState(nextAccent);
        setResolvedMode(applyAppearanceToDocument(initialMode, nextAccent));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!mounted || mode !== "system" || typeof window.matchMedia !== "function") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedMode(applyAppearanceToDocument("system", accent));
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [accent, mode, mounted]);

  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      setModeState(nextMode);
      setResolvedMode(applyAppearanceToDocument(nextMode, accent));
      try {
        window.localStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode);
      } catch {
        // ignore
      }
    },
    [accent],
  );

  const setAccent = useCallback(
    (nextAccent: AccentId) => {
      setAccentState(nextAccent);
      setResolvedMode(applyAppearanceToDocument(mode, nextAccent));
      try {
        window.localStorage.setItem(ACCENT_STORAGE_KEY, nextAccent);
      } catch {
        // ignore
      }
    },
    [mode],
  );

  const resetAppearance = useCallback(() => {
    setModeState(DEFAULT_THEME_MODE);
    setAccentState(DEFAULT_ACCENT);
    setResolvedMode(resolveEffectiveTheme(DEFAULT_THEME_MODE));
    applyAppearanceToDocument(DEFAULT_THEME_MODE, DEFAULT_ACCENT);
    try {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, DEFAULT_THEME_MODE);
      window.localStorage.setItem(ACCENT_STORAGE_KEY, DEFAULT_ACCENT);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AppearanceContext.Provider
      value={{
        mode,
        resolvedMode,
        accent,
        mounted,
        setMode,
        setAccent,
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
