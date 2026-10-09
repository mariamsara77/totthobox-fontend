"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { NotificationModalProvider } from "@/context/NotificationModalContext";

const SettingsModalWrapper = dynamic(
  () => import("@/components/SettingsModalWrapper"),
  { ssr: false },
);
const SearchModalWrapper = dynamic(
  () => import("@/components/search/SearchModalWrapper"),
  { ssr: false },
);
const NotificationModalWrapper = dynamic(
  () => import("@/components/notifications/NotificationModalWrapper"),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AuthModalProvider>
          <SettingsModalProvider>
            <SearchModalProvider>
              <NotificationModalProvider>
                {children}
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
        </AuthModalProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
