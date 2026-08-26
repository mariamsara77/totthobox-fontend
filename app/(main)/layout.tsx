import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";

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
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-50 md:hidden">
            <Navbar />
          </div>

          <main className="app-main flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
