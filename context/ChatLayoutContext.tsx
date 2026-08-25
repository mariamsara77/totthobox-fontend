"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ChatLayoutContextValue = {
  mobileListOpen: boolean;
  setMobileListOpen: (open: boolean) => void;
  openMobileList: () => void;
  closeMobileList: () => void;
};

const ChatLayoutContext = createContext<ChatLayoutContextValue | null>(null);

export function ChatLayoutProvider({ children }: { children: React.ReactNode }) {
  const [mobileListOpen, setMobileListOpen] = useState(true);

  const value = useMemo(
    () => ({
      mobileListOpen,
      setMobileListOpen,
      openMobileList: () => setMobileListOpen(true),
      closeMobileList: () => setMobileListOpen(false),
    }),
    [mobileListOpen],
  );

  return <ChatLayoutContext.Provider value={value}>{children}</ChatLayoutContext.Provider>;
}

export function useChatLayout() {
  const context = useContext(ChatLayoutContext);
  if (!context) throw new Error("useChatLayout must be used inside ChatLayoutProvider");
  return context;
}
