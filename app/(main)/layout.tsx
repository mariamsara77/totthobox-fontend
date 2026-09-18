import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import RelatedLinks from "@/components/RelatedLinks";
import Script from "next/script";

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
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="md:hidden sticky top-0 z-50">
              <Navbar />
            </div>

            <main className="flex-1 w-full">{children}</main>
            <RelatedLinks />
            <Footer />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521"}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
