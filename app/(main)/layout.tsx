import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import HelpfulContent from "@/components/HelpfulContent";
import RelatedLinks from "@/components/RelatedLinks";
import { normalizeContactCategories } from "@/lib/contact-categories";

const configuredApiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://admin.totthobox.com";
const apiBase = (
  /^https?:\\/\\//i.test(configuredApiBase)
    ? configuredApiBase
    : "https://admin.totthobox.com"
)
  .replace(/\\/+$/, "")
  .replace(/\\/api$/i, "");

async function getInitialContactCategories() {
  try {
    const response = await fetch(`${apiBase}/api/sidebar/contact-categories`, {
      next: { revalidate: 300, tags: ["contact-sidebar-categories"] },
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return [];
    return normalizeContactCategories(await response.json());
  } catch {
    // Sidebar remains available if the API is temporarily unreachable.
    return [];
  }
}

export const metadata: Metadata = {
  metadataBase: new URL("https://totthobox.com"),
  title: {
    default: "Totthobox - আপনার প্রয়োজনীয় সকল তথ্য ও সেবা এক জায়গায়",
    template: "%s | Totthobox",
  },
  description:
    "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। প্রয়োজনীয় সকল তথ্য ও সেবা সহজে পেতে ভিজিট করুন।",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialContactCategories = await getInitialContactCategories();

  return (
    <div>
      <SidebarProvider>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar initialContactCategories={initialContactCategories} />

          {/* Main content area */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="md:hidden sticky top-0 z-50">
              <Navbar />
            </div>

            <main className="flex-1 w-full">{children}</main>
            <HelpfulContent />
            <RelatedLinks />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
