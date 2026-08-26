"use client";

import { useRef } from "react";
import { usePdfEditorStore } from "./store";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { PageCanvas } from "./PageCanvas";
import { Upload, Loader2 } from "lucide-react";

const surfaceClass = "bg-zinc-400/10 border border-zinc-400/25 rounded-2xl";
const buttonClass = "rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 p-4";

export default function PdfEditor() {
  const { file, currentPage, isLoading, error, setFile, setPdfDoc, setNumPages, setLoading, setError } = usePdfEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (selectedFile: File) => {
    try {
      setLoading(true);
      setError(null);
      setFile(selectedFile);
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const buffer = await selectedFile.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buffer }).promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
    } catch (err) {
      console.error(err);
      setError("PDF লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[75vh] p-6 ${surfaceClass}`}>
        <Upload className="size-12 opacity-50" />
        <div className="space-y-2 text-center mt-4">
          <h1 className="text-2xl">Advanced PDF Editor</h1>
          <p className="opacity-50 max-w-md">
            Text • Highlight • Draw • Signature • Rotate • Download — সব ফ্রি
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} className={`${buttonClass} mt-4`}>
          PDF আপলোড করুন
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] overflow-hidden ${surfaceClass}`}>
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-zinc-400/10">
          {isLoading ? (
            <div className="flex items-center gap-4 opacity-50 mt-20">
              <Loader2 className="size-6 animate-spin" />
              লোড হচ্ছে...
            </div>
          ) : (
            <PageCanvas pageNumber={currentPage} />
          )}
        </div>
      </div>
      {error && <div className="border-t border-zinc-400/25 bg-zinc-400/25 p-4 text-sm">{error}</div>}
    </div>
  );
}
