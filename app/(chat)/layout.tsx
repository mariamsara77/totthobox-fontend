import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import { ChatLayoutProvider } from "@/context/ChatLayoutContext";

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-chat-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "মেসেজ | Totthobox",
    template: "%s | Totthobox",
  },
  description: "Totthobox-এর আধুনিক ব্যক্তিগত মেসেজিং।",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bengali.variable} chat-layout-root h-[calc(100dvh-4rem)] min-h-0 w-full overflow-hidden overscroll-none bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`}
    >
      <ChatLayoutProvider>
        <main className="flex h-full min-h-0 w-full min-w-0 overflow-hidden">
          {children}
        </main>
      </ChatLayoutProvider>
      <style>{`
        .chat-layout-root > main > section,
        .chat-layout-root > main > section > div,
        .chat-layout-root > main > section > div > div {
          min-height: 0;
        }

        .chat-layout-root > main > section > div > div > main {
          min-height: 0 !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        .chat-layout-root > main > section > div > div > aside,
        .chat-layout-root > main > section > div > div > main {
          height: 100%;
        }
      `}</style>
    </div>
  );
}
