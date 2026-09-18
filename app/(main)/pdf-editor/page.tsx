import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/pdf-editor" },
  openGraph: { title: "অনলাইন PDF এডিটর ও PDF টুলস | Totthobox", description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।", url: "https://totthobox.com/pdf-editor", siteName: "Totthobox", type: "website", locale: "bn_BD" },
  twitter: { card: "summary_large_image", title: "অনলাইন PDF এডিটর ও PDF টুলস | Totthobox", description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।" },
  title: "Free Advanced PDF Editor | Edit PDF Online",
  description:
    "Edit PDF files online for free. Add text, highlight, draw, signature, rotate pages and download. 100% private, no upload to server.",
  keywords: [
    "pdf editor",
    "edit pdf online",
    "free pdf editor",
    "pdf text editor",
    "annotate pdf",
    "pdf highlighter",
  ],
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <PdfEditor />
    </main>
  );
}