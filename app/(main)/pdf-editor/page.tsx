import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
  title: "PDF এডিটর ও ডকুমেন্ট স্ক্যানার | তথ্যবক্স",
  description:
    "ব্রাউজারেই PDF-এ লেখা যোগ করুন, হাইলাইট ও আঁকুন, পৃষ্ঠা ঘোরান, স্বাক্ষর দিন এবং JPG/PNG স্ক্যান থেকে PDF তৈরি করুন। ফাইল সার্ভারে আপলোড না করেই কাজ করুন।",
  alternates: {
    canonical: "https://totthobox.com/pdf-editor",
  },
  openGraph: {
    title: "PDF এডিটর ও ডকুমেন্ট স্ক্যানার | তথ্যবক্স",
    description:
      "PDF সম্পাদনা, টীকা, স্বাক্ষর এবং ছবি থেকে PDF তৈরি করার সহজ অনলাইন টুল।",
    url: "https://totthobox.com/pdf-editor",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF এডিটর ও ডকুমেন্ট স্ক্যানার | তথ্যবক্স",
    description:
      "ব্রাউজারেই PDF সম্পাদনা করুন ও স্ক্যান করা ছবি থেকে PDF তৈরি করুন।",
  },
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PdfEditor />
    </main>
  );
}
