import type { Metadata } from "next";
import AdvancedDocumentConverter from "@/components/tools/AdvancedDocumentConverter";

export const metadata: Metadata = {
  title: "Free Online Document Converter & PDF Tools | PDF, Word, Excel",
  description:
    "Convert and edit documents entirely in your browser. Merge, split, compress PDFs, convert DOCX to HTML, Excel to CSV, images to PDF and more. No upload, 100% private & free.",
  keywords: [
    "document converter",
    "pdf to word",
    "word to pdf",
    "excel converter",
    "ppt to pdf",
    "online document converter",
    "free pdf converter",
    "docx to pdf",
    "odt to pdf",
    "pdf merge",
    "pdf split",
    "pdf compress",
  ],
  openGraph: {
    title: "Advanced Document Converter & PDF Toolkit",
    description: "Merge, split, convert documents completely in your browser. Private & free.",
    type: "website",
  },
};

export default function DocumentConverterPage() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <AdvancedDocumentConverter />
    </main>
  );
}