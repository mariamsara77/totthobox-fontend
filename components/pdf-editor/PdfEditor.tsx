"use client";

import { useRef } from "react";
import { usePdfEditorStore } from "./store";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { PageCanvas } from "./PageCanvas";
import { Upload, Loader2, Camera } from "lucide-react";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const PAGE_MARGIN = 24;

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
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const preparePdfFile = async (selectedFile: File): Promise<File> => {
    const name = selectedFile.name.toLowerCase();
    const isPng = selectedFile.type === "image/png" || name.endsWith(".png");
    const isJpeg =
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/jpg" ||
      /\.(jpe?g)$/.test(name);
    const isPdf = selectedFile.type === "application/pdf" || name.endsWith(".pdf");

    if (!isPdf && !isPng && !isJpeg) {
      throw new Error("শুধু PDF, JPG বা PNG ফাইল ব্যবহার করুন।");
    }
    if (selectedFile.size > MAX_UPLOAD_BYTES) {
      throw new Error("ফাইলের আকার সর্বোচ্চ ৫০ MB হতে পারবে।");
    }
    if (isPdf) return selectedFile;

    const { PDFDocument } = await import("pdf-lib");
    const imagePdf = await PDFDocument.create();
    const bytes = await selectedFile.arrayBuffer();
    const image = isPng
      ? await imagePdf.embedPng(bytes)
      : await imagePdf.embedJpg(bytes);
    const page = imagePdf.addPage([A4_WIDTH, A4_HEIGHT]);
    const maxWidth = A4_WIDTH - PAGE_MARGIN * 2;
    const maxHeight = A4_HEIGHT - PAGE_MARGIN * 2;
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;

    page.drawImage(image, {
      x: (A4_WIDTH - width) / 2,
      y: (A4_HEIGHT - height) / 2,
      width,
      height,
    });

    const pdfBytes = await imagePdf.save();
    const pdfName = selectedFile.name.replace(/\.(png|jpe?g)$/i, "") || "scan";
    return new File([pdfBytes as unknown as BlobPart], pdfName + ".pdf", {
      type: "application/pdf",
    });
  };

  const loadPdf = async (selectedFile: File) => {
    setLoading(true);
    setError(null);

    try {
      const preparedFile = await preparePdfFile(selectedFile);
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buffer = await preparedFile.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buffer }).promise;

      // Replace the editor state only after the new document parses successfully.
      setFile(preparedFile);
      setPdfDoc(doc);
      setNumPages(doc.numPages);
    } catch (err) {
      console.error("PDF load error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "ফাইলটি খোলা যায়নি। সঠিক PDF, JPG বা PNG ফাইল দিয়ে আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (selectedFile) void loadPdf(selectedFile);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
        aria-label="PDF বা ছবি নির্বাচন করুন"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-label="ক্যামেরা দিয়ে স্ক্যান করা ছবি নির্বাচন করুন"
      />

      {file ? (
        <div className="flex h-[calc(100dvh-80px)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-zinc-400/25 bg-zinc-900">
          <Toolbar
            onNewFile={() => fileInputRef.current?.click()}
            onScan={() => cameraInputRef.current?.click()}
          />

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <Sidebar />
            <div className="flex min-w-0 flex-1 items-start justify-center overflow-auto bg-zinc-800/80 p-4">
              {isLoading ? (
                <div className="mt-20 flex items-center gap-4 text-zinc-300" role="status">
                  <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                  ফাইল প্রস্তুত হচ্ছে…
                </div>
              ) : (
                <PageCanvas pageNumber={currentPage} />
              )}
            </div>
          </div>

          {error ? (
            <div role="alert" className="bg-rose-500/15 px-4 py-2 text-sm text-rose-300">
              {error}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[65vh] flex-col items-center justify-center rounded-2xl bg-zinc-400/10 p-6 text-center sm:min-h-[75vh] sm:p-12">
          {isLoading ? (
            <Loader2 className="mb-5 size-12 animate-spin text-zinc-500" aria-hidden="true" />
          ) : (
            <Upload className="mb-5 size-12 text-zinc-400" aria-hidden="true" />
          )}
          <h1 className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl">
            PDF এডিটর ও ডকুমেন্ট স্ক্যানার
          </h1>
          <p className="mb-8 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            PDF খুলুন, অথবা JPG/PNG স্ক্যান করা ছবি থেকে একটি A4 PDF তৈরি করুন। ফাইল আপনার ব্রাউজারেই প্রক্রিয়া করা হয়।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="size-4" aria-hidden="true" />
              PDF / ছবি খুলুন
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-400/15 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-400/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera className="size-4" aria-hidden="true" />
              ক্যামেরা দিয়ে স্ক্যান
            </button>
          </div>
          {error ? (
            <p role="alert" className="mt-5 max-w-lg text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          ) : null}
          <p className="mt-5 text-xs text-zinc-500">
            সর্বোচ্চ ফাইল আকার ৫০ MB · PDF, JPG ও PNG
          </p>
        </div>
      )}
    </>
  );
}
