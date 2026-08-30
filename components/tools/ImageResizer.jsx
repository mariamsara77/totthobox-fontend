"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const FORMATS = [
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPG" },
  { value: "png", label: "PNG" },
];

const ASPECT_RATIOS = [
  { value: NaN, label: "Free" },
  { value: 1, label: "1:1" },
  { value: 16 / 9, label: "16:9" },
  { value: 4 / 3, label: "4:3" },
  { value: 9 / 16, label: "9:16" },
];

const PRESETS = [
  { label: "১০০%", type: "percent", value: 100 },
  { label: "৭৫%", type: "percent", value: 75 },
  { label: "৫০%", type: "percent", value: 50 },
  { label: "২৫%", type: "percent", value: 25 },
  { label: "FHD", type: "width", value: 1920 },
  { label: "Web", type: "width", value: 800 },
  { label: "Thumb", type: "width", value: 400 },
];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const pow = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, pow)).toFixed(2)} ${units[pow]}`;
}

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(85);
  const [outputWidth, setOutputWidth] = useState("");
  const [outputHeight, setOutputHeight] = useState("");
  const [lockAspect, setLockAspect] = useState(true);

  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [finalWidth, setFinalWidth] = useState(0);
  const [finalHeight, setFinalHeight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Crop state
  const [cropMode, setCropMode] = useState(false);
  const [cropData, setCropData] = useState(null); // {x, y, w, h} relative to natural size
  const [aspectRatio, setAspectRatio] = useState(NaN);

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const cropBoxRef = useRef(null);
  const containerRef = useRef(null);

  // Drag crop state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [tempCrop, setTempCrop] = useState(null); // display coords

  const savings =
    originalSize && compressedSize
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  // ---------- Upload ----------
  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("শুধুমাত্র ইমেজ ফাইল আপলোড করুন।");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError("ফাইল সাইজ ৩০MB এর বেশি হতে পারবে না।");
      return;
    }

    setError(null);
    setFileName(file.name);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setOutputWidth("");
        setOutputHeight("");
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setCropData(null);
        setTempCrop(null);
        setCropMode(false);
        setQuality(85);
        setFormat("webp");
        setLockAspect(true);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  // ---------- Process Image (Canvas) ----------
  const processImage = useCallback(async () => {
    if (!imageSrc) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      let sourceX = 0;
      let sourceY = 0;
      let sourceW = img.naturalWidth;
      let sourceH = img.naturalHeight;

      // Apply crop if exists
      if (cropData) {
        sourceX = cropData.x;
        sourceY = cropData.y;
        sourceW = cropData.w;
        sourceH = cropData.h;
      }

      // Create temp canvas for rotate + flip
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      const rad = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));

      // After rotation the bounding box changes
      let rotatedW = sourceW;
      let rotatedH = sourceH;
      if (rotation % 180 !== 0) {
        rotatedW = sourceH;
        rotatedH = sourceW;
      }

      tempCanvas.width = rotatedW;
      tempCanvas.height = rotatedH;

      tempCtx.translate(rotatedW / 2, rotatedH / 2);
      tempCtx.rotate(rad);
      if (flipH) tempCtx.scale(-1, 1);
      if (flipV) tempCtx.scale(1, -1);
      tempCtx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        -sourceW / 2,
        -sourceH / 2,
        sourceW,
        sourceH
      );

      // Now resize
      let targetW = outputWidth ? parseInt(outputWidth, 10) : rotatedW;
      let targetH = outputHeight ? parseInt(outputHeight, 10) : rotatedH;

      if (lockAspect && (outputWidth || outputHeight)) {
        const ratio = rotatedW / rotatedH;
        if (outputWidth && !outputHeight) {
          targetH = Math.round(targetW / ratio);
        } else if (outputHeight && !outputWidth) {
          targetW = Math.round(targetH * ratio);
        } else if (outputWidth && outputHeight) {
          // keep both but respect lock? use scale
          targetW = parseInt(outputWidth, 10);
          targetH = parseInt(outputHeight, 10);
        }
      }

      targetW = Math.max(1, targetW || rotatedW);
      targetH = Math.max(1, targetH || rotatedH);

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = targetW;
      finalCanvas.height = targetH;
      const ctx = finalCanvas.getContext("2d");

      // High quality resize
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(tempCanvas, 0, 0, targetW, targetH);

      const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
      const q = format === "png" ? undefined : quality / 100;

      const blob = await new Promise((resolve) =>
        finalCanvas.toBlob(resolve, mime, q)
      );

      if (!blob) throw new Error("Encoding failed");

      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setCompressedSize(blob.size);
      setFinalWidth(targetW);
      setFinalHeight(targetH);
    } catch (err) {
      console.error(err);
      setError("ইমেজ প্রসেস করতে সমস্যা হয়েছে।");
    } finally {
      setIsProcessing(false);
    }
  }, [
    imageSrc,
    cropData,
    rotation,
    flipH,
    flipV,
    outputWidth,
    outputHeight,
    lockAspect,
    format,
    quality,
  ]);

  // Auto process when settings change
  useEffect(() => {
    if (imageSrc) {
      const timer = setTimeout(() => processImage(), 300);
      return () => clearTimeout(timer);
    }
  }, [
    imageSrc,
    cropData,
    rotation,
    flipH,
    flipV,
    outputWidth,
    outputHeight,
    lockAspect,
    format,
    quality,
  ]);

  // ---------- Crop helpers ----------
  const getImageDisplayRect = () => {
    const img = imageRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const displayRatio = rect.width / rect.height;

    let drawW, drawH, offsetX, offsetY;
    if (naturalRatio > displayRatio) {
      drawW = rect.width;
      drawH = rect.width / naturalRatio;
      offsetX = 0;
      offsetY = (rect.height - drawH) / 2;
    } else {
      drawH = rect.height;
      drawW = rect.height * naturalRatio;
      offsetX = (rect.width - drawW) / 2;
      offsetY = 0;
    }
    return { drawW, drawH, offsetX, offsetY, rect, naturalW: img.naturalWidth, naturalH: img.naturalHeight };
  };

  const startCropDrag = (e) => {
    if (!cropMode) return;
    e.preventDefault();
    const info = getImageDisplayRect();
    if (!info) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - info.rect.left - info.offsetX;
    const y = clientY - info.rect.top - info.offsetY;

    setIsDragging(true);
    setDragStart({ x, y });
    setTempCrop({ x, y, w: 0, h: 0 });
  };

  const onCropDrag = (e) => {
    if (!isDragging || !dragStart) return;
    e.preventDefault();
    const info = getImageDisplayRect();
    if (!info) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let x = clientX - info.rect.left - info.offsetX;
    let y = clientY - info.rect.top - info.offsetY;

    x = Math.max(0, Math.min(x, info.drawW));
    y = Math.max(0, Math.min(y, info.drawH));

    let w = x - dragStart.x;
    let h = y - dragStart.y;

    let cropX = dragStart.x;
    let cropY = dragStart.y;

    if (w < 0) {
      cropX = x;
      w = Math.abs(w);
    }
    if (h < 0) {
      cropY = y;
      h = Math.abs(h);
    }

    // Aspect ratio lock
    if (!isNaN(aspectRatio) && aspectRatio > 0) {
      if (Math.abs(w / h) > aspectRatio) {
        h = w / aspectRatio;
      } else {
        w = h * aspectRatio;
      }
      // clamp
      if (cropX + w > info.drawW) w = info.drawW - cropX;
      if (cropY + h > info.drawH) h = info.drawH - cropY;
      if (!isNaN(aspectRatio)) {
        if (w / h > aspectRatio) h = w / aspectRatio;
        else w = h * aspectRatio;
      }
    }

    setTempCrop({ x: cropX, y: cropY, w, h });
  };

  const endCropDrag = () => {
    if (!isDragging || !tempCrop || tempCrop.w < 5 || tempCrop.h < 5) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);

    const info = getImageDisplayRect();
    if (!info) return;

    const scaleX = info.naturalW / info.drawW;
    const scaleY = info.naturalH / info.drawH;

    setCropData({
      x: Math.round(tempCrop.x * scaleX),
      y: Math.round(tempCrop.y * scaleY),
      w: Math.round(tempCrop.w * scaleX),
      h: Math.round(tempCrop.h * scaleY),
    });
    setCropMode(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const move = (e) => onCropDrag(e);
    const up = () => endCropDrag();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [isDragging, dragStart, tempCrop, aspectRatio]);

  // ---------- Actions ----------
  const rotate = (deg) => setRotation((r) => (r + deg + 360) % 360);
  const toggleFlipH = () => setFlipH((v) => !v);
  const toggleFlipV = () => setFlipV((v) => !v);

  const applyPreset = (preset) => {
    if (preset.type === "percent") {
      const w = Math.round((originalWidth * preset.value) / 100);
      const h = Math.round((originalHeight * preset.value) / 100);
      setOutputWidth(String(w));
      setOutputHeight(String(h));
      setLockAspect(true);
    } else {
      setOutputWidth(String(preset.value));
      setOutputHeight("");
      setLockAspect(true);
    }
  };

  const resetSize = () => {
    setOutputWidth("");
    setOutputHeight("");
  };

  const resetCrop = () => {
    setCropData(null);
    setTempCrop(null);
  };

  const resetAll = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropData(null);
    setTempCrop(null);
    setOutputWidth("");
    setOutputHeight("");
    setQuality(85);
    setFormat("webp");
    setLockAspect(true);
    setCropMode(false);
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageSrc(null);
    setPreviewUrl(null);
    setFileName("");
    setOriginalSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setCompressedSize(0);
    setFinalWidth(0);
    setFinalHeight(0);
    resetAll();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const download = () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    const ext = format === "jpeg" ? "jpg" : format;
    a.download = `totthobox_${Date.now()}.${ext}`;
    a.click();
  };

  // ---------- Render ----------
  return (
    <section className="w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl tracking-tight ">
              ইমেজ স্টুডিও
            </h1>
            <p className="text-sm  mt-0.5">
              ক্রপ · রিসাইজ · কম্প্রেস
            </p>
          </div>

          {imageSrc && (
            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-400/25 "
              >
                রিসেট
              </button>
              <label className="cursor-pointer">
                <span className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-400/25  inline-block">
                  বদলান
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={removeImage}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-rose-500/10 text-rose-500"
              >
                মুছুন
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 flex items-start gap-4">
            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm  text-rose-700 dark:text-rose-300">সমস্যা হয়েছে</p>
              <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {!imageSrc ? (
          /* ========== EMPTY STATE ========== */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-400/25 rounded-2xl p-4 text-center cursor-pointer hover:border-zinc-400/50  bg-zinc-400/10"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <div className="mx-auto size-14 rounded-2xl bg-zinc-400/10 flex items-center justify-center  shadow-indigo-500/25 mb-4">
              <svg className="w-7 h-7 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-base">ইমেজ আপলোড করুন</p>
            <p className="text-sm">ড্র্যাগ করে ছাড়ুন অথবা ক্লিক করুন</p>
            <p className="text-xs opacity-50 mt-3">JPG · PNG · WebP · GIF · সর্বোচ্চ ৩০MB</p>
          </div>
        ) : (
          /* ========== EDITOR ========== */
          <div className="space-y-5">
            {/* Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original + Crop */}
              <div className="bg-zinc-400/10 rounded-2xl overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-400/25 dark:border-zinc-700 flex items-center justify-between text-xs">
                  <span className="  tracking-wider">Original</span>
                  <span className="">
                    {originalWidth}×{originalHeight}
                  </span>
                  <span className=" ">
                    {formatBytes(originalSize)}
                  </span>
                </div>

                <div
                  ref={containerRef}
                  className="relative select-none"
                  style={{ minHeight: 200 }}
                  onMouseDown={startCropDrag}
                  onTouchStart={startCropDrag}
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Original"
                    className="block w-full"
                    style={{
                      maxHeight: 280,
                      objectFit: "contain",
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                      transition: "transform 0.2s",
                    }}
                    draggable={false}
                  />

                  {/* Crop overlay */}
                  {(cropMode || tempCrop) && tempCrop && (
                    <div
                      className="absolute border-2 border-indigo-500 bg-indigo-500/20 pointer-events-none"
                      style={{
                        left: `${tempCrop.x + (getImageDisplayRect()?.offsetX || 0)}px`,
                        top: `${tempCrop.y + (getImageDisplayRect()?.offsetY || 0)}px`,
                        width: tempCrop.w,
                        height: tempCrop.h,
                      }}
                    />
                  )}

                  {cropData && !cropMode && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-zinc-400/10  text-xs px-2 py-1 rounded">
                      <span>
                        Crop: {cropData.w}×{cropData.h}
                      </span>
                      <button onClick={resetCrop} className="underline opacity-50 hover:opacity-100">
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Crop + Transform toolbar */}
                <div className="p-2 space-y-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.label}
                        onClick={() => {
                          setAspectRatio(r.value);
                          setCropMode(true);
                          setTempCrop(null);
                        }}
                        className={`px-2 py-1 text-xs rounded-md ${
                          cropMode && aspectRatio === r.value
                            ? "bg-indigo-500 "
                            : "hover:bg-zinc-400/25 "
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}

                    <div className="w-px h-5 bg-zinc-400/10 mx-2" />

                    <button
                      onClick={() => rotate(-90)}
                      title="বামে ঘোরান"
                      className="p-2 rounded-md hover:bg-zinc-400/25"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => rotate(90)}
                      title="ডানে ঘোরান"
                      className="p-1.5 rounded-md hover:bg-zinc-400/25"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={toggleFlipH}
                      title="Horizontal Flip"
                      className={`p-1.5 rounded-md ${flipH ? "bg-zinc-400/10 " : "hover:bg-zinc-400/25"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                    <button
                      onClick={toggleFlipV}
                      title="Vertical Flip"
                      className={`p-1.5 rounded-md ${flipV ? "bg-zinc-400/10 " : "hover:bg-zinc-400/25"}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={resetCrop}
                      className="px-2 py-1 text-xs rounded-md hover:bg-zinc-400/25 "
                    >
                      Crop Clear
                    </button>
                    {cropMode ? (
                      <span className="text-xs">
                        ড্র্যাগ করে ক্রপ এলাকা সিলেক্ট করুন
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setCropMode(true);
                          setTempCrop(null);
                        }}
                        className="px-3 py-1.5 text-xs  rounded-lg bg-zinc-400/10  hover:bg-zinc-400/25"
                      >
                        Crop শুরু করুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-zinc-400/10 rounded-2xl overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-400/25 dark:border-zinc-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-700 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-9000" />
                    </span>
                    <span className="  tracking-wider">Edited</span>
                  </div>
                  {finalWidth > 0 && (
                    <span className="">
                      {finalWidth}×{finalHeight}px
                      {savings > 0 && (
                        <span className="  ml-1">
                          · ↓{savings}%
                        </span>
                      )}
                    </span>
                  )}
                  {compressedSize > 0 && (
                    <span className=" ">
                      {formatBytes(compressedSize)}
                    </span>
                  )}
                </div>

                <div className="relative min-h-[180px] flex items-center justify-center p-2 bg-zinc-700/40 bg-zinc-900">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full rounded-lg "
                      style={{ maxHeight: 260, objectFit: "contain" }}
                    />
                  ) : (
                    <span className="text-xs ">প্রিভিউ লোড হচ্ছে...</span>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls Card */}
            <div className="rounded-2xl border border-zinc-400/25 bg-zinc-950 bg-zinc-900/50 overflow-hidden">
              <div className="p-4 space-y-5">
                {/* Format */}
                <div>
                  <label className="text-sm   mb-2 block">
                    ফরম্যাট
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-zinc-400/25 dark:border-zinc-700">
                    {FORMATS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFormat(f.value)}
                        className={`flex-1 py-2.5 text-sm   ${
                          format === f.value
                            ? "bg-indigo-500 "
                            : "bg-zinc-400/10  hover:bg-zinc-900 hover:bg-zinc-700"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                {format !== "png" && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm  ">
                        কোয়ালিটি
                      </label>
                      <span className="text-sm font-bold ">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-400/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs  mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                )}

                {/* Resize */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm  ">
                      রিসাইজ
                    </label>
                    <button
                      onClick={resetSize}
                      className="text-xs  hover:text-zinc-200 dark:hover:text-zinc-300"
                    >
                      রিসেট
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <input
                      type="number"
                      value={outputWidth}
                      onChange={(e) => setOutputWidth(e.target.value)}
                      placeholder={`প্রস্থ ${originalWidth || ""}`}
                      className="w-full p-2 rounded-lg bg-zinc-400/10 border-none outline-none text-sm"
                    />
                    <input
                      type="number"
                      value={outputHeight}
                      onChange={(e) => setOutputHeight(e.target.value)}
                      placeholder={`উচ্চতা ${originalHeight || ""}`}
                      className="w-full p-2 rounded-lg bg-zinc-400/10 border-none outline-none text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-zinc-400/10 hover:bg-zinc-800 hover:bg-zinc-700 "
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Download bar */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden border border-zinc-400/25 dark:border-zinc-700">
                    {FORMATS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFormat(f.value)}
                        className={`py-2 text-xs  ${
                          format === f.value
                            ? "bg-indigo-500 "
                            : "bg-zinc-400/10 "
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={download}
                    disabled={!previewUrl || isProcessing}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50  text-sm  flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    ডাউনলোড
                    {compressedSize > 0 && (
                      <span className="opacity-80 text-xs">{formatBytes(compressedSize)}</span>
                    )}
                  </button>
                </div>

                {savings > 0 && (
                  <p className="text-center text-xs  mt-2 ">
                    মূল ফাইলের চেয়ে {savings}% ছোট
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-4 text-sm ">
          <div className="text-center mb-10">
            <h2 className="text-xl  font-bold  tracking-tight">
              সিভি ও চাকরির আবেদনের জন্য পারফেক্ট ছবি তৈরি করুন
            </h2>
            <p className="mt-2 text-sm  max-w-2xl mx-auto">
              যেকোনো ওয়েবসাইটে ছবি আপলোডের নির্দিষ্ট শর্ত (রেজুলেশন, ফাইল সাইজ ও ফরম্যাট) এখন পূরণ করুন সহজেই।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-400/25 p-4">
              <h3 className="font-bold text-zinc-50 text-zinc-200 mb-2">সরকারি চাকরির আবেদন</h3>
              <p className="text-sm">
                টেলিটক বা বিপিএসসি ফর্মে ছবির নির্দিষ্ট মাপ <strong>৩০০×৩০০ পিক্সেল</strong> (সর্বোচ্চ ১০০KB) এবং
                স্বাক্ষরের মাপ <strong>৩০০×৮০ পিক্সেল</strong> সহজেই সেট করুন।
              </p>
            </div>
            <div className="rounded-xl border border-zinc-400/25 p-4">
              <h3 className="font-bold text-zinc-50 text-zinc-200 mb-2">সিভি ও পোর্টফোলিও</h3>
              <p className="text-sm">
                প্রফেশনাল সিভি বা LinkedIn প্রোফাইলের জন্য ছবিকে <strong>১:১ (স্কয়ার)</strong> রেশিওতে ক্রপ করুন এক
                ক্লিকেই।
              </p>
            </div>
            <div className="rounded-xl border border-zinc-400/25 p-4">
              <h3 className="font-bold text-zinc-50 text-zinc-200 mb-2">ফাইল সাইজ কমানো</h3>
              <p className="text-sm">
                ছবির কোয়ালিটি ঠিক রেখে ফাইলের সাইজ (KB/MB) কমান। ভিসা ফর্ম বা ভার্সিটি অ্যাডমিশনে সাইজ লিমিট নিয়ে আর চিন্তা
                নেই।
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              কীভাবে ব্যবহার করবেন?
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>
                <strong>ছবি আপলোড:</strong> মোবাইল বা কম্পিউটার থেকে ছবি সিলেক্ট করুন বা ড্র্যাগ করুন।
              </li>
              <li>
                <strong>ক্রপ (ঐচ্ছিক):</strong> রেশিও বাটন চেপে ড্র্যাগ করে অপ্রয়োজনীয় অংশ কেটে দিন।
              </li>
              <li>
                <strong>পিক্সেল সেট:</strong> রিসাইজ বক্সে প্রস্থ ও উচ্চতা দিন (যেমন ৩০০×৩০০)।
              </li>
              <li>
                <strong>কোয়ালিটি ও ফরম্যাট:</strong> স্লাইডার দিয়ে সাইজ কমান এবং JPG/PNG/WebP বেছে ডাউনলোড করুন।
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}