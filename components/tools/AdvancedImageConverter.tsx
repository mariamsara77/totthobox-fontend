"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Upload,
  Crop,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  Droplets,
  Aperture,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";

type Step = "idle" | "editing" | "converting" | "done";
type Format = "png" | "jpg" | "webp" | "avif" | "ico" | "bmp" | "svg";

const FORMATS: Format[] = ["png", "jpg", "webp", "avif", "ico", "bmp", "svg"];
const ASPECT_RATIOS = [
  { label: "Free", value: 0 },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "9:16", value: 9 / 16 },
  { label: "3:2", value: 3 / 2 },
];

export default function AdvancedImageConverter() {
  const [step, setStep] = useState<Step>("idle");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [sourceFormat, setSourceFormat] = useState("");
  const [originalSize, setOriginalSize] = useState("");

  // Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Transform
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  // Output
  const [targetFormat, setTargetFormat] = useState<Format>("png");
  const [quality, setQuality] = useState(0.92);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultSize, setResultSize] = useState("");
  const [resultName, setResultName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Resize
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [originalW, setOriginalW] = useState(0);
  const [originalH, setOriginalH] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFile = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      setError("Maximum file size is 25 MB");
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      setFileName(file.name);
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      setSourceFormat(ext === "jpeg" ? "jpg" : ext);
      setOriginalSize(formatBytes(file.size));

      const img = new Image();
      img.onload = () => {
        setOriginalW(img.width);
        setOriginalH(img.height);
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = src;

      setStep("editing");
      // Reset all edits
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
      setAspect(0);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Create the final canvas with all transforms + filters
  const createFinalCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!imageSrc || !croppedAreaPixels) throw new Error("No image");

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Apply rotation + flip first
    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    ctx.drawImage(image, 0, 0);

    // Now crop from the rotated canvas
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d")!;

    const scaleX = image.width / image.width; // already full
    croppedCanvas.width = croppedAreaPixels.width;
    croppedCanvas.height = croppedAreaPixels.height;

    croppedCtx.drawImage(
      canvas,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    // Final resize if needed
    if (resizeWidth !== originalW || resizeHeight !== originalH) {
      const resized = document.createElement("canvas");
      resized.width = resizeWidth;
      resized.height = resizeHeight;
      const rCtx = resized.getContext("2d")!;
      rCtx.imageSmoothingEnabled = true;
      rCtx.imageSmoothingQuality = "high";
      rCtx.drawImage(croppedCanvas, 0, 0, resizeWidth, resizeHeight);
      return resized;
    }

    return croppedCanvas;
  };

  const convert = async () => {
    if (!imageSrc) return;
    setStep("converting");
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 80)); // allow spinner to show

      const finalCanvas = await createFinalCanvas();

      // Flatten for JPG/BMP
      if (["jpg", "bmp"].includes(targetFormat)) {
        const flat = document.createElement("canvas");
        flat.width = finalCanvas.width;
        flat.height = finalCanvas.height;
        const fCtx = flat.getContext("2d")!;
        fCtx.fillStyle = "#ffffff";
        fCtx.fillRect(0, 0, flat.width, flat.height);
        fCtx.drawImage(finalCanvas, 0, 0);
        finalCanvas.width = flat.width;
        finalCanvas.height = flat.height;
        finalCanvas.getContext("2d")!.drawImage(flat, 0, 0);
      }

      let blob: Blob;

      switch (targetFormat) {
        case "png":
          blob = await canvasToBlob(finalCanvas, "image/png");
          break;
        case "jpg":
          blob = await canvasToBlob(finalCanvas, "image/jpeg", quality);
          break;
        case "webp":
          blob = await canvasToBlob(finalCanvas, "image/webp", quality);
          break;
        case "avif":
          blob = await canvasToBlob(finalCanvas, "image/avif", quality);
          break;
        case "bmp":
          blob = canvasToBmp(finalCanvas);
          break;
        case "ico":
          blob = await canvasToIco(finalCanvas);
          break;
        case "svg":
          blob = canvasToSvg(finalCanvas);
          break;
        default:
          throw new Error("Unsupported format");
      }

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultBlob(blob);
      setResultSize(formatBytes(blob.size));
      setResultName(buildFilename(targetFormat));
      setStep("done");
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Try a different format or browser.");
      setStep("editing");
    }
  };

  const download = () => {
    if (!resultBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(resultBlob);
    a.download = resultName;
    a.click();
  };

  const resetAll = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setStep("idle");
    setImageSrc(null);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helpers
  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.src = url;
    });
  }

  function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }

  function canvasToBlob(canvas: HTMLCanvasElement, type: string, q?: number) {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject()), type, q);
    });
  }

  function canvasToBmp(canvas: HTMLCanvasElement): Blob {
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;
    const rowSize = Math.floor((24 * w + 31) / 32) * 4;
    const pixelArraySize = rowSize * h;
    const fileSize = 54 + pixelArraySize;
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    view.setUint8(0, 0x42);
    view.setUint8(1, 0x4d);
    view.setUint32(2, fileSize, true);
    view.setUint32(10, 54, true);
    view.setUint32(14, 40, true);
    view.setInt32(18, w, true);
    view.setInt32(22, h, true);
    view.setUint16(26, 1, true);
    view.setUint16(28, 24, true);
    view.setUint32(34, pixelArraySize, true);
    let offset = 54;
    for (let y = h - 1; y >= 0; y--) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        view.setUint8(offset++, data[i + 2]);
        view.setUint8(offset++, data[i + 1]);
        view.setUint8(offset++, data[i]);
      }
      offset += rowSize - w * 3;
    }
    return new Blob([buffer], { type: "image/bmp" });
  }

  async function canvasToIco(canvas: HTMLCanvasElement): Promise<Blob> {
    const png = await canvasToBlob(canvas, "image/png");
    const bytes = new Uint8Array(await png.arrayBuffer());
    const w = canvas.width >= 256 ? 0 : canvas.width;
    const h = canvas.height >= 256 ? 0 : canvas.height;
    const buffer = new ArrayBuffer(22 + bytes.length);
    const view = new DataView(buffer);
    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, 1, true);
    view.setUint8(6, w);
    view.setUint8(7, h);
    view.setUint8(8, 0);
    view.setUint8(9, 0);
    view.setUint16(10, 1, true);
    view.setUint16(12, 32, true);
    view.setUint32(14, bytes.length, true);
    view.setUint32(18, 22, true);
    new Uint8Array(buffer, 22).set(bytes);
    return new Blob([buffer], { type: "image/x-icon" });
  }

  function canvasToSvg(canvas: HTMLCanvasElement): Blob {
    const dataUrl = canvas.toDataURL("image/png");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image width="100%" height="100%" href="${dataUrl}"/></svg>`;
    return new Blob([svg], { type: "image/svg+xml" });
  }

  function buildFilename(ext: string) {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `Totthobox_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${ext}`;
  }

  // Resize handlers
  const onWidthChange = (w: number) => {
    setResizeWidth(w);
    if (keepAspect && originalW) {
      setResizeHeight(Math.round((w / originalW) * originalH));
    }
  };
  const onHeightChange = (h: number) => {
    setResizeHeight(h);
    if (keepAspect && originalH) {
      setResizeWidth(Math.round((h / originalH) * originalW));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
          <ImageIcon className="size-3.5" />
          Advanced Image Editor & Converter
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Professional Image Converter
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Crop · Rotate · Flip · Resize · Filters · Convert — সব কিছু রিয়েল-টাইমে, সম্পূর্ণ ব্রাউজারে। কোনো আপলোড নেই।
        </p>
      </header>

      {/* ========== IDLE ========== */}
      {step === "idle" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-12 sm:p-16 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors bg-zinc-50/50 dark:bg-zinc-900/30"
        >
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/60">
            <Upload className="size-7 text-blue-600" />
          </div>
          <p className="text-base font-medium text-zinc-800 dark:text-zinc-200">
            ইমেজ এখানে ড্র্যাগ & ড্রপ করো
          </p>
          <p className="mt-1 text-sm text-zinc-500">অথবা ক্লিক করে বেছে নাও</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-sm"
          >
            ফাইল বেছে নাও
          </button>
          <p className="mt-3 text-xs text-zinc-400">Max 25 MB · PNG JPG WebP AVIF BMP ICO SVG GIF</p>
        </div>
      )}

      {/* ========== EDITING ========== */}
      {step === "editing" && imageSrc && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Live Preview Area */}
          <div className="space-y-4">
            <div className="relative h-[420px] sm:h-[520px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect || undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid
                style={{
                  containerStyle: { background: "#09090b" },
                  mediaStyle: {
                    transform: `scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
                  },
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setRotation((r) => r - 90)} className="btn-icon" title="Rotate Left">
                <RotateCcw className="size-4" />
              </button>
              <button onClick={() => setRotation((r) => r + 90)} className="btn-icon" title="Rotate Right">
                <RotateCw className="size-4" />
              </button>
              <button onClick={() => setFlipH((f) => !f)} className={`btn-icon ${flipH ? "bg-blue-600 text-white" : ""}`} title="Flip Horizontal">
                <FlipHorizontal className="size-4" />
              </button>
              <button onClick={() => setFlipV((f) => !f)} className={`btn-icon ${flipV ? "bg-blue-600 text-white" : ""}`} title="Flip Vertical">
                <FlipVertical className="size-4" />
              </button>
              <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.1))} className="btn-icon">
                <ZoomOut className="size-4" />
              </button>
              <span className="text-xs text-zinc-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="btn-icon">
                <ZoomIn className="size-4" />
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Aspect Ratio</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.label}
                    onClick={() => setAspect(ar.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      aspect === ar.value
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="size-3.5" /> Filters
              </label>
              <FilterSlider label="Brightness" value={brightness} min={50} max={150} onChange={setBrightness} />
              <FilterSlider label="Contrast" value={contrast} min={50} max={150} onChange={setContrast} />
              <FilterSlider label="Saturation" value={saturation} min={0} max={200} onChange={setSaturation} />
              <FilterSlider label="Blur" value={blur} min={0} max={10} step={0.5} onChange={setBlur} />
            </div>

            {/* Resize */}
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="size-3.5" /> Resize
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-zinc-400">Width</span>
                  <input
                    type="number"
                    value={resizeWidth}
                    onChange={(e) => onWidthChange(Number(e.target.value))}
                    className="w-full mt-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2.5 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400">Height</span>
                  <input
                    type="number"
                    value={resizeHeight}
                    onChange={(e) => onHeightChange(Number(e.target.value))}
                    className="w-full mt-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-2.5 py-1.5 text-sm"
                  />
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} className="rounded" />
                Keep aspect ratio
              </label>
            </div>

            {/* Format + Quality */}
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Output Format</label>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTargetFormat(f)}
                    className={`py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                      targetFormat === f
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {["jpg", "webp", "avif"].includes(targetFormat) && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Quality</span>
                  <span className="font-medium">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}

            <button
              onClick={convert}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 transition shadow-sm"
            >
              <Crop className="size-4" />
              Convert Now
            </button>

            <button onClick={resetAll} className="w-full text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 py-1">
              অন্য ইমেজ বেছে নাও
            </button>
          </div>
        </div>
      )}

      {/* ========== CONVERTING ========== */}
      {step === "converting" && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="relative size-16 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-blue-600 animate-spin" />
          </div>
          <p className="font-medium text-zinc-700 dark:text-zinc-300">Processing your image...</p>
          <p className="text-xs text-zinc-400 mt-1">Applying crop, filters & converting</p>
        </div>
      )}

      {/* ========== DONE ========== */}
      {step === "done" && resultUrl && (
        <div className="space-y-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="size-5" />
            <span className="font-medium">Conversion Complete!</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-zinc-400 mb-2">Original</p>
              <img src={imageSrc!} alt="Original" className="w-full rounded-xl border object-contain max-h-64 bg-zinc-50 dark:bg-zinc-900" />
              <p className="text-xs text-zinc-400 mt-1.5">{sourceFormat.toUpperCase()} · {originalSize}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400 mb-2">Result</p>
              <img src={resultUrl} alt="Converted" className="w-full rounded-xl border border-emerald-200 dark:border-emerald-900 object-contain max-h-64 bg-emerald-50/30 dark:bg-emerald-950/20" />
              <p className="text-xs text-zinc-400 mt-1.5">{targetFormat.toUpperCase()} · {resultSize}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={download}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 transition"
            >
              <Download className="size-4" />
              Download .{targetFormat}
            </button>
            <button
              onClick={() => setStep("editing")}
              className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              আরো এডিট করো
            </button>
            <button
              onClick={resetAll}
              className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              নতুন ইমেজ
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 flex items-start gap-3 text-sm text-red-700 dark:text-red-300">
          <X className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {/* SEO Content */}
      <section className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 p-6 space-y-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          ফ্রি অ্যাডভান্সড ইমেজ কনভার্টার ও এডিটর
        </h2>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-2 leading-relaxed">
          <p>
            <strong>Crop, Rotate, Flip, Resize, Brightness, Contrast, Saturation</strong> সহ সব এডিটিং ফিচার এক জায়গায়। তারপর PNG, JPG, WebP, AVIF, BMP, ICO বা SVG তে কনভার্ট করুন — সম্পূর্ণ ব্রাউজারে, কোনো আপলোড ছাড়াই।
          </p>
          <p>
            রিয়েল-টাইম প্রিভিউ দেখে দেখে এডিট করুন। সর্বোচ্চ ২৫ MB পর্যন্ত ফাইল সাপোর্ট করে। মোবাইল ও ডেস্কটপ দুটোতেই পারফেক্ট কাজ করে।
          </p>
        </div>
      </section>
    </div>
  );
}

// Small helper component
function FilterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-500">{label}</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{value}{label === "Blur" ? "px" : "%"}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600 h-1.5"
      />
    </div>
  );
}