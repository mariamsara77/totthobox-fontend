"use client";

import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import { SidebarProvider } from "@/context/SidebarContext"; // এটিও গ্লোবাল হলে এখানে রাখতে পারেন

// React 19 Warning Suppress Logic
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    origError.apply(console, args);
  };
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SidebarProvider>
          <SettingsModalProvider>
            {children}
          </SettingsModalProvider>
        </SidebarProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}