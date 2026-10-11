import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/pdf-editor" },
  openGraph: { title: "অনলাইন PDF এডিটর ও PDF টুলস", description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।", url: "https://totthobox.com/pdf-editor", siteName: "Totthobox", type: "website", locale: "bn_BD" 
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "অনলাইন PDF এডিটর ও PDF টুলস", description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।" 
    images: ["https://totthobox.com/og-image.png"],
  },
  title: "Free Advanced PDF Editor | Edit PDF Online",
  description:
    "Edit PDF files online for free. Add text, highlight, draw, signature, rotate pages and download. 100% private, no upload to server.",
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PdfEditor />
    </main>
  );
}