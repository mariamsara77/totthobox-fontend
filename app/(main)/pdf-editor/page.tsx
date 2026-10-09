import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/pdf-editor" },
  openGraph: { title: "ফ্রি অনলাইন PDF এডিটর | Totthobox", description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।", url: "https://totthobox.com/pdf-editor", siteName: "Totthobox", type: "website", locale: "bn_BD" },
  twitter: { card: "summary_large_image", title: "ফ্রি অনলাইন PDF এডিটর | Totthobox", description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।" },
  title: "ফ্রি অনলাইন PDF এডিটর | Totthobox",
  description:
    "ব্রাউজারেই PDF পৃষ্ঠা ঘোরান, লেখা যোগ করুন, হাইলাইট, আঁকা ও স্বাক্ষর বসান। ফাইল সার্ভারে আপলোড না করেই সম্পাদিত PDF ডাউনলোড করুন।",
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PdfEditor />
    </main>
  );
}