import type { Metadata, Viewport } from "next";
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
    <div className="w-full max-w-full min-w-0 overflow-x-clip">
      <div className="flex w-full min-w-0">
        <div className="flex flex-1 min-w-0 w-full flex-col">
          <div className="sticky top-0 z-50 w-full">
            <NavbarHeader />
          </div>
          <main className="flex-1 w-full min-w-0">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
