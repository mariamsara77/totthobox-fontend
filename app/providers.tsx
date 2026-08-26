"use client";

import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: "rounded-xl border border-zinc-400/25 bg-zinc-400/10",
            }}
          />
        </SettingsModalProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
