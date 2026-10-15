import type { Metadata } from "next";
import AdvancedDocumentConverter from "@/components/tools/AdvancedDocumentConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/document" },
  title: "Free Online Document Converter & PDF Tools | PDF, Word, Excel",
  description:
    "Convert and edit documents entirely in your browser. Merge, split, compress PDFs, convert DOCX to HTML, Excel to CSV, images to PDF and more. No upload, 100% private & free.",
  openGraph: {
    title: "Advanced Document Converter & PDF Toolkit",
    description: "Merge, split, convert documents completely in your browser. Private & free.",
    type: "website",
    url: "https://totthobox.com/converter/document",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
,
  twitter: { card: "summary_large_image", title: "Advanced Document Converter & PDF Toolkit", description: "Merge, split, convert documents completely in your browser. Private & free.", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function DocumentConverterPage() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <AdvancedDocumentConverter />
    </main>
  );
}