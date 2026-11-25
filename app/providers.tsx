"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AppearanceProvider } from "@/context/AppearanceContext";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { NotificationModalProvider } from "@/context/NotificationModalContext";
import { MobileNavProvider } from "@/context/MobileNavContext";

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
const MobileNavDrawer = dynamic(
  () => import("@/components/navigation/MobileNavDrawer"),
  { ssr: false },
);
const SavedHistorySheet = dynamic(
  () => import("@/components/navigation/SavedHistorySheet"),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <AuthModalProvider>
          <SettingsModalProvider>
            <SearchModalProvider>
              <NotificationModalProvider>
                <MobileNavProvider>
                  {children}
                  <MobileNavDrawer />
                  <SavedHistorySheet />
                  <SettingsModalWrapper />
                  <SearchModalWrapper />
                  <NotificationModalWrapper />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        borderRadius: "var(--radius-lg)",
                        fontSize: "13px",
                        background: "var(--surface-card)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--surface-border)",
                      },
                    }}
                  />
                </MobileNavProvider>
              </NotificationModalProvider>
            </SearchModalProvider>
          </SettingsModalProvider>
        </AuthModalProvider>
      </AuthProvider>
    </AppearanceProvider>
  );
}
