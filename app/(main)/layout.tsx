import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import HelpfulContent from "@/components/HelpfulContent";
import RelatedLinks from "@/components/RelatedLinks";

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
    <div className="w-full max-w-full min-w-0 overflow-x-clip">
      <SidebarProvider>
        <div className="flex w-full min-w-0">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex min-w-0 flex-1 w-full flex-col">
            <div className="md:hidden sticky top-0 z-50 w-full">
              <Navbar />
            </div>

            <main className="flex-1 w-full min-w-0">{children}</main>
            <HelpfulContent />
            <RelatedLinks />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
