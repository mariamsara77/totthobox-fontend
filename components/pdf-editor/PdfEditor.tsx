"use client";

import { useRef, useState, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { usePdfEditorStore } from "./store";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { PageCanvas } from "./PageCanvas";
import { Upload, Loader2, ScanLine } from "lucide-react";

const DocumentScanner = dynamic(() => import("./DocumentScanner"), { ssr: false });

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;

export default function PdfEditor() {
  const {
    file,
    numPages,
    currentPage,
    isLoading,
    error,
    setFile,
    setPdfDoc,
    setNumPages,
    setLoading,
    setError,
  } = usePdfEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const loadPdf = async (selectedFile: File) => {
    const looksLikePdf =
      selectedFile.type === "application/pdf" ||
      /\.pdf$/i.test(selectedFile.name);

    if (!looksLikePdf) {
      setError("অনুগ্রহ করে একটি PDF ফাইল নির্বাচন করুন।");
      return false;
    }

    if (selectedFile.size === 0) {
      setError("ফাইলটি খালি। অন্য একটি PDF নির্বাচন করুন।");
      return false;
    }

    if (selectedFile.size > MAX_PDF_SIZE_BYTES) {
      setError("ফাইলটি ৫০ MB-এর বেশি। ছোট PDF নির্বাচন করুন।");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buffer = await selectedFile.arrayBuffer();
      const loadedDocument = await pdfjs.getDocument({ data: buffer }).promise;
      const previousDocument = usePdfEditorStore.getState().pdfDoc;

      // Commit the new file only after PDF.js has successfully parsed it.
      setFile(selectedFile);
      setPdfDoc(loadedDocument);
      setNumPages(loadedDocument.numPages);

      if (previousDocument && previousDocument !== loadedDocument) {
        void Promise.resolve(previousDocument.destroy?.()).catch(() => undefined);
      }
      return true;
    } catch (loadError: unknown) {
      console.error("PDF load failed", loadError);
      const message =
        loadError instanceof Error && /password/i.test(loadError.message)
          ? "পাসওয়ার্ড-সুরক্ষিত PDF এখন খোলা যাচ্ছে না।"
          : "PDF ফাইলটি পড়া যায়নি। ফাইলটি ঠিক আছে কি না যাচাই করে আবার চেষ্টা করুন।";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    // Clearing permits selecting the same file again after a failed load.
    event.currentTarget.value = "";
    if (selectedFile) void loadPdf(selectedFile);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        aria-label="PDF ফাইল নির্বাচন করুন"
      />

      {!file ? (
        <div className="flex min-h-[75vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-400/25 bg-zinc-400/10 p-6 text-center sm:p-12">
          {isLoading ? (
            <Loader2 className="mb-5 size-12 animate-spin text-zinc-400" aria-hidden="true" />
          ) : (
            <Upload className="mb-5 size-12 text-zinc-400" aria-hidden="true" />
          )}
          <h1 className="mb-2 text-lg font-semibold tracking-tight sm:text-xl">
            PDF এডিটর
          </h1>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            PDF-এ লেখা যোগ করুন, হাইলাইট করুন, আঁকুন, স্বাক্ষর দিন, পৃষ্ঠা ঘোরান এবং সম্পাদিত ফাইল ডাউনলোড করুন। ফাইল আপনার ব্রাউজারেই প্রসেস হয়।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "লোড হচ্ছে..." : "PDF আপলোড করুন"}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setScannerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-400/30 px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-400/10 dark:text-zinc-100"
            >
              <ScanLine className="size-4" aria-hidden="true" />
              ক্যামেরায় স্ক্যান করুন
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-4 max-w-md text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}
          <p className="mt-4 text-xs text-zinc-500">
            সর্বোচ্চ ফাইল সাইজ ৫০ MB
          </p>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-80px)] min-h-[440px] flex-col overflow-hidden rounded-2xl border border-zinc-400/25 bg-zinc-900">
          <Toolbar onNewFile={() => fileInputRef.current?.click()} onScanDocuments={() => setScannerOpen(true)} />

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <Sidebar />

            <div className="flex min-w-0 flex-1 items-start justify-center overflow-auto bg-zinc-800/80 p-4">
              {isLoading ? (
                <div className="mt-20 flex items-center gap-4 text-zinc-400" role="status">
                  <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                  নতুন PDF লোড হচ্ছে...
                </div>
              ) : (
                <PageCanvas pageNumber={currentPage} />
              )}
            </div>
          </div>

          {error && (
            <div role="alert" className="bg-rose-500/15 px-4 py-2 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <p className="border-t border-zinc-400/15 px-3 py-1.5 text-center text-[11px] text-zinc-400">
            {numPages.toLocaleString("bn-BD")} পৃষ্ঠা · ফাইল আপনার ডিভাইসেই থাকে
          </p>
        </div>
      )}

      {scannerOpen && (
        <DocumentScanner
          onClose={() => setScannerOpen(false)}
          onCreatePDF={loadPdf}
        />
      )}
    </>
  );
}
