"use client";

import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { NotificationModalProvider } from "@/context/NotificationModalContext";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";
import SearchModalWrapper from "@/components/search/SearchModalWrapper";
import NotificationModalWrapper from "@/components/notifications/NotificationModalWrapper";

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
          <SearchModalProvider>
            <NotificationModalProvider>
              {children}

              {/* সব Modal এখানে body লেভেলে */}
              <SettingsModalWrapper />
              <SearchModalWrapper />
              <NotificationModalWrapper />

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: { borderRadius: "14px", fontSize: "13px" },
                }}
              />
            </NotificationModalProvider>
          </SearchModalProvider>
        </SettingsModalProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
