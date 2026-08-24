import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { SettingsModalProvider } from "@/context/SettingsModalContext";
import SettingsModalWrapper from "@/components/SettingsModalWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: {
    default: "Totthobox - আপনার প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex min-h-screen flex-1 flex-col">
              <div className="md:hidden sticky top-0 z-50">
                <Navbar />
              </div>

              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </div>
      </SidebarProvider>
    </div>
  );
}