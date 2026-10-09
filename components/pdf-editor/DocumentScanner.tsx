"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  Check,
  FileImage,
  LoaderCircle,
  RotateCw,
  ScanLine,
  Trash2,
  X,
} from "lucide-react";

type ScanPage = {
  id: number;
  blob: Blob;
  previewUrl: string;
  rotation: number;
  mode: "color" | "bw";
};

type Props = {
  onClose: () => void;
  onCreatePDF: (file: File) => Promise<boolean>;
};

const MAX_PAGES = 30;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1800;

function canvasToJpeg(canvas: HTMLCanvasElement, quality = 0.88): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("ছবিটি প্রসেস করা যায়নি। আবার চেষ্টা করুন।"));
      },
      "image/jpeg",
      quality,
    );
  });
}

async function prepareImage(file: Blob): Promise<Blob> {
  if (file.size === 0) throw new Error("ছবির ফাইলটি খালি।");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("প্রতি ছবির সাইজ ২০ MB-এর কম হতে হবে।");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");

  try {
    if (!context) throw new Error("ছবি প্রসেস করার জন্য Canvas চালু করা যায়নি।");
    // A white background avoids unexpected black areas in transparent images.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await canvasToJpeg(canvas);
  } finally {
    bitmap.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}

export default function DocumentScanner({ onClose, onCreatePDF }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pageIdRef = useRef(0);
  const [pages, setPages] = useState<ScanPage[]>([]);
  const pagesRef = useRef<ScanPage[]>([]);
  const [cameraError, setCameraError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("এই ব্রাউজারে সরাসরি ক্যামেরা ব্যবহার করা যাচ্ছে না। ফাইল থেকে ছবি যোগ করুন।");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch {
        setCameraError(
          "ক্যামেরার অনুমতি পাওয়া যায়নি। ব্রাউজারের camera permission চালু করুন অথবা ফাইল থেকে ছবি যোগ করুন।",
        );
      }
    };

    void startCamera();

    return () => {
      active = false;
      stopCamera();
      pagesRef.current.forEach((page) => URL.revokeObjectURL(page.previewUrl));
    };
  }, [stopCamera]);

  const addPreparedPages = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    if (pagesRef.current.length + files.length > MAX_PAGES) {
      setCameraError(`একটি PDF-এ সর্বোচ্চ ${MAX_PAGES}টি স্ক্যান পৃষ্ঠা যোগ করা যাবে।`);
      return;
    }

    setCameraError("");
    setStatusMessage("ছবি প্রস্তুত করা হচ্ছে...");

    const prepared: ScanPage[] = [];
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error("শুধু ছবির ফাইল যোগ করা যাবে।");
        }
        const blob = await prepareImage(file);
        prepared.push({
          id: ++pageIdRef.current,
          blob,
          previewUrl: URL.createObjectURL(blob),
          rotation: 0,
          mode: "color",
        });
      }

      setPages((current) => [...current, ...prepared]);
      setStatusMessage(`${prepared.length.toLocaleString("bn-BD")}টি ছবি যোগ হয়েছে।`);
    } catch (error) {
      prepared.forEach((page) => URL.revokeObjectURL(page.previewUrl));
      setCameraError(
        error instanceof Error ? error.message : "ছবি যোগ করা যায়নি।",
      );
    } finally {
      setStatusMessage("");
    }
  }, []);

  const capturePage = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) {
      setCameraError("ক্যামেরা প্রস্তুত হয়নি। একটু অপেক্ষা করে আবার চেষ্টা করুন।");
      return;
    }

    if (pagesRef.current.length >= MAX_PAGES) {
      setCameraError(`একটি PDF-এ সর্বোচ্চ ${MAX_PAGES}টি পৃষ্ঠা যোগ করা যাবে।`);
      return;
    }

    const scale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(video.videoWidth, video.videoHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    const context = canvas.getContext("2d");

    try {
      if (!context) throw new Error("ক্যামেরার ছবি প্রসেস করা যাচ্ছে না।");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await canvasToJpeg(canvas);
      const page: ScanPage = {
        id: ++pageIdRef.current,
        blob,
        previewUrl: URL.createObjectURL(blob),
        rotation: 0,
        mode: "color",
      };
      setPages((current) => [...current, page]);
      setCameraError("");
      setStatusMessage(`পৃষ্ঠা ${(pagesRef.current.length + 1).toLocaleString("bn-BD")} যোগ হয়েছে।`);
      window.setTimeout(() => setStatusMessage(""), 1800);
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "ছবি তোলা যায়নি।");
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  };

  const handleImageFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    await addPreparedPages(selected);
  };

  const updatePage = (id: number, update: Partial<Pick<ScanPage, "rotation" | "mode">>) => {
    setPages((current) =>
      current.map((page) => page.id === id ? { ...page, ...update } : page),
    );
  };

  const removePage = (id: number) => {
    const target = pagesRef.current.find((page) => page.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    setPages((current) => current.filter((page) => page.id !== id));
  };

  const createPdf = async () => {
    if (pages.length === 0 || isCreating) return;

    setIsCreating(true);
    setCameraError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const document = await PDFDocument.create();

      for (let index = 0; index < pages.length; index += 1) {
        const scan = pages[index];
        setStatusMessage(
          `PDF তৈরি হচ্ছে: ${(index + 1).toLocaleString("bn-BD")} / ${pages.length.toLocaleString("bn-BD")}`,
        );

        const bitmap = await createImageBitmap(scan.blob);
        const rotation = ((scan.rotation % 360) + 360) % 360;
        const swapsSides = rotation === 90 || rotation === 270;
        const canvas = document.createElement("canvas");
        canvas.width = swapsSides ? bitmap.height : bitmap.width;
        canvas.height = swapsSides ? bitmap.width : bitmap.height;
        const context = canvas.getContext("2d");

        try {
          if (!context) throw new Error("স্ক্যান পৃষ্ঠা প্রস্তুত করা যায়নি।");
          if (scan.mode === "bw") context.filter = "grayscale(1) contrast(1.25)";
          context.translate(canvas.width / 2, canvas.height / 2);
          context.rotate((rotation * Math.PI) / 180);
          context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
          const processed = await canvasToJpeg(canvas, 0.9);
          const image = await document.embedJpg(await processed.arrayBuffer());
          const landscape = image.width > image.height;
          const pageWidth = landscape ? 842 : 595;
          const pageHeight = landscape ? 595 : 842;
          const margin = 18;
          const fit = Math.min(
            (pageWidth - margin * 2) / image.width,
            (pageHeight - margin * 2) / image.height,
          );
          const width = image.width * fit;
          const height = image.height * fit;
          const pdfPage = document.addPage([pageWidth, pageHeight]);

          pdfPage.drawImage(image, {
            x: (pageWidth - width) / 2,
            y: (pageHeight - height) / 2,
            width,
            height,
          });
        } finally {
          bitmap.close();
          canvas.width = 0;
          canvas.height = 0;
        }
      }

      const bytes = await document.save();
      const exactBuffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer;
      const file = new File([exactBuffer], `totthobox-scan-${Date.now()}.pdf`, {
        type: "application/pdf",
      });
      const loaded = await onCreatePDF(file);
      if (loaded) onClose();
    } catch (error) {
      setCameraError(
        error instanceof Error ? error.message : "স্ক্যান PDF তৈরি করা যায়নি।",
      );
    } finally {
      setIsCreating(false);
      setStatusMessage("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-zinc-950/90 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-scanner-title"
    >
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-zinc-700 px-4 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
              <ScanLine className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="document-scanner-title" className="text-base font-semibold sm:text-lg">
                ডকুমেন্ট স্ক্যানার
              </h2>
              <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-400 sm:text-sm">
                ক্যামেরায় একাধিক পৃষ্ঠা তুলুন, ঘোরান বা সাদা-কালো করুন, তারপর PDF বানিয়ে এডিট করুন।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="স্ক্যানার বন্ধ করুন"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:p-6">
          <section className="min-w-0">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-[4/3] max-h-[54vh] w-full object-contain"
                aria-label="ডকুমেন্ট স্ক্যানের ক্যামেরা প্রিভিউ"
              />
              <div className="pointer-events-none absolute inset-[9%] rounded-xl border-2 border-dashed border-emerald-300/80 shadow-[0_0_0_999px_rgba(0,0,0,0.16)]" />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                কাগজটি ফ্রেমের মধ্যে রাখুন
              </span>
            </div>

            {cameraError && (
              <p role="alert" className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-sm leading-6 text-rose-300">
                {cameraError}
              </p>
            )}
            {statusMessage && (
              <p role="status" className="mt-3 text-sm text-emerald-300">
                {statusMessage}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void capturePage()}
                disabled={isCreating}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <Camera className="size-4" aria-hidden="true" />
                পৃষ্ঠা তুলুন
              </button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700">
                <FileImage className="size-4" aria-hidden="true" />
                ছবি যোগ করুন
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="sr-only"
                  onChange={(event) => void handleImageFiles(event)}
                  disabled={isCreating}
                />
              </label>
              <span className="text-xs text-zinc-500">
                {pages.length.toLocaleString("bn-BD")} / {MAX_PAGES.toLocaleString("bn-BD")} পৃষ্ঠা
              </span>
            </div>
          </section>

          <section className="flex min-w-0 flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">স্ক্যান করা পৃষ্ঠা</h3>
              <span className="text-xs text-zinc-500">সর্বোচ্চ ৩০টি</span>
            </div>

            {pages.length === 0 ? (
              <div className="flex min-h-40 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 px-5 py-8 text-center text-sm text-zinc-500">
                <FileImage className="mb-2 size-7" aria-hidden="true" />
                এখনো কোনো পৃষ্ঠা যোগ হয়নি
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-h-[54vh] lg:overflow-y-auto lg:pr-1">
                {pages.map((page, index) => (
                  <article key={page.id} className="min-w-0 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={page.previewUrl}
                        alt={`স্ক্যান পৃষ্ঠা ${index + 1}`}
                        className="size-full object-contain"
                        style={{
                          transform: `rotate(${page.rotation}deg)`,
                          filter: page.mode === "bw" ? "grayscale(1) contrast(1.25)" : undefined,
                        }}
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">
                        পৃষ্ঠা {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 p-2">
                      <button
                        type="button"
                        onClick={() => updatePage(page.id, { rotation: (page.rotation + 90) % 360 })}
                        className="rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-700"
                        aria-label={`পৃষ্ঠা ${index + 1} ঘোরান`}
                        title="ঘোরান"
                      >
                        <RotateCw className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePage(page.id, { mode: page.mode === "bw" ? "color" : "bw" })}
                        className={`rounded-lg px-2 py-2 text-[11px] transition ${page.mode === "bw" ? "bg-emerald-500/20 text-emerald-300" : "text-zinc-300 hover:bg-zinc-700"}`}
                        aria-label={`পৃষ্ঠা ${index + 1} সাদা-কালো করুন`}
                        title="রঙ / সাদা-কালো"
                      >
                        B&W
                      </button>
                      <button
                        type="button"
                        onClick={() => removePage(page.id)}
                        className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-500/10"
                        aria-label={`পৃষ্ঠা ${index + 1} মুছুন`}
                        title="মুছুন"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => void createPdf()}
              disabled={pages.length === 0 || isCreating}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="size-4" aria-hidden="true" />
              )}
              {isCreating ? "PDF তৈরি হচ্ছে..." : "PDF তৈরি করে এডিট করুন"}
            </button>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              ফাইল আপনার ব্রাউজারেই থাকে। স্বয়ংক্রিয় প্রান্ত শনাক্তকরণ, perspective correction ও OCR এই প্রাথমিক স্ক্যানারে নেই।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
