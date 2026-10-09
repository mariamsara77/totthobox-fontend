import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
  title: "PDF এডিটর ও PDF টুলস | তথ্যবক্স",
  description:
    "ব্রাউজারেই PDF-এ লেখা যোগ, হাইলাইট, ড্রইং, স্বাক্ষর, পৃষ্ঠা ঘোরানো এবং সম্পাদিত PDF ডাউনলোড করুন। আপনার ফাইল সার্ভারে আপলোড করা হয় না।",
  alternates: { canonical: "https://totthobox.com/pdf-editor" },
  openGraph: {
    title: "PDF এডিটর ও PDF টুলস | তথ্যবক্স",
    description:
      "ব্রাউজারেই PDF সম্পাদনা করুন। লেখা, হাইলাইট, ড্রইং, স্বাক্ষর ও পৃষ্ঠা ঘোরানোর সুবিধা।",
    url: "https://totthobox.com/pdf-editor",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF এডিটর ও PDF টুলস | তথ্যবক্স",
    description:
      "ব্রাউজারেই PDF সম্পাদনা করুন—কোনো ফাইল সার্ভারে আপলোড নয়।",
  },
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PdfEditor />
    </main>
  );
}
