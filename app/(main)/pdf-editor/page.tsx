import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const metadata: Metadata = {
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