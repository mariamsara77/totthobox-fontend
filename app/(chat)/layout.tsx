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
      className={`${bengali.variable} min-h-0 bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`}
    >
      <ChatLayoutProvider>
        <main className="min-h-0 w-full overflow-hidden">{children}</main>
      </ChatLayoutProvider>
    </div>
  );
}
