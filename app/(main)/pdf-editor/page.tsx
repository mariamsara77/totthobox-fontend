import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
  title: "PDF এডিটর ও PDF টুলস | তথ্যবক্স",
  description:
    "ক্যামেরায় একাধিক ডকুমেন্ট পৃষ্ঠা স্ক্যান করুন, PDF-এ লেখা, হাইলাইট ও স্বাক্ষর যোগ করুন, পৃষ্ঠা ঘোরান এবং সম্পাদিত PDF ডাউনলোড করুন। ফাইল ব্রাউজারেই প্রসেস হয়।",
  alternates: { canonical: "https://totthobox.com/pdf-editor" },
  openGraph: {
    title: "PDF এডিটর ও PDF টুলস | তথ্যবক্স",
    description:
      "ক্যামেরায় পৃষ্ঠা স্ক্যান, PDF-এ লেখা ও স্বাক্ষর যোগ, হাইলাইট, পৃষ্ঠা ঘোরানো এবং ডাউনলোড—সব ব্রাউজারেই করুন।",
    url: "https://totthobox.com/pdf-editor",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF এডিটর ও PDF টুলস | তথ্যবক্স",
    description:
      "ডকুমেন্ট স্ক্যান ও PDF সম্পাদনা করুন—কোনো ফাইল সার্ভারে আপলোড নয়।",
  },
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PdfEditor />
    </main>
  );
}
