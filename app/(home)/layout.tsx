import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import NavbarHeader from "@/components/NavbarHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: {
    default: "Totthobox - প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex min-h-screen">
        <div className="flex min-h-screen flex-1 flex-col">
          <div className="sticky top-0 z-50">
            <NavbarHeader />
          </div>
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
