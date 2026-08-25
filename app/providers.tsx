"use client";

import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
          <SettingsModalProvider>
            {children}
          </SettingsModalProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}