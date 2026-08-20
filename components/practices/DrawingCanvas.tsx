"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { PaperStyle, Tool } from "./practiceClient";

export interface DrawingCanvasHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  save: (name: string, format: string, transparent: boolean) => void;
  toggleFullscreen: () => void;
  changePaperStyle: (style: PaperStyle) => void;
  setGuideLines: (v: boolean) => void;
}

interface Props {
  activeTool: Tool;
  currentColor: string;
  currentSize: number;
  opacity: number;
  guideText: string;
  paperStyle: PaperStyle;
  pressureSensitivity: boolean;
  smoothing: boolean;
  guideLines: boolean;
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, Props>(function DrawingCanvas(
  {
    activeTool,
    currentColor,
    currentSize,
    opacity,
    guideText,
    paperStyle,
    pressureSensitivity,
    smoothing,
    guideLines,
    onHistoryChange,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const history = useRef<ImageData[]>([]);
  const historyIndex = useRef(-1);
  const dpr = useRef(1);

  // ---------- helpers ----------
  const getCtx = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  const getLogicalSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return { w: 0, h: 0 };
    return {
      w: canvas.width / dpr.current,
      h: canvas.height / dpr.current,
    };
  };

  const resetTransform = (ctx: CanvasRenderingContext2D) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const applyScale = (ctx: CanvasRenderingContext2D) => {
    ctx.setTransform(dpr.current, 0, 0, dpr.current, 0, 0);
  };

  // ---------- Paper background ----------
  const drawPaper = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { w, h } = getLogicalSize();
      if (!w || !h) return;

      applyScale(ctx);

      // base color
      const colors: Record<PaperStyle, string> = {
        blank: "#ffffff",
        lined: "#ffffff",
        grid: "#ffffff",
        graph: "#ffffff",
        yellow: "#fefce8",
        parchment: "#fffbeb",
      };
      ctx.fillStyle = colors[paperStyle] || "#ffffff";
      ctx.fillRect(0, 0, w, h);

      if (!guideLines) return;

      ctx.lineWidth = 1;

      if (paperStyle === "lined") {
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        for (let y = 32; y < h; y += 32) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      if (paperStyle === "grid") {
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        const size = 28;
        for (let x = size; x < w; x += size) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = size; y < h; y += size) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      if (paperStyle === "graph") {
        const sub = 28;
        const main = 140;
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        for (let x = sub; x < w; x += sub) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = sub; y < h; y += sub) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(0,0,0,0.22)";
        ctx.lineWidth = 1.5;
        for (let x = main; x < w; x += main) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = main; y < h; y += main) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }
    },
    [paperStyle, guideLines]
  );

  // ---------- History (ImageData – much more reliable) ----------
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    resetTransform(ctx);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyScale(ctx);

    // trim future
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }

    history.current.push(imageData);
    if (history.current.length > 80) {
      history.current.shift();
    } else {
      historyIndex.current++;
    }

    onHistoryChange(historyIndex.current > 0, historyIndex.current < history.current.length - 1);
  }, [onHistoryChange]);

  const restoreState = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const ctx = getCtx();
      if (!canvas || !ctx || !history.current[index]) return;

      resetTransform(ctx);
      ctx.putImageData(history.current[index], 0, 0);
      applyScale(ctx);

      historyIndex.current = index;
      onHistoryChange(index > 0, index < history.current.length - 1);
    },
    [onHistoryChange]
  );

  // ---------- Resize ----------
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = getCtx();
    if (!canvas || !container || !ctx) return;

    // save current content
    let current: ImageData | null = null;
    if (canvas.width > 0) {
      resetTransform(ctx);
      current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    dpr.current = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;

    canvas.width = Math.floor(w * dpr.current);
    canvas.height = Math.floor(h * dpr.current);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    applyScale(ctx);

    // restore previous content if any
    if (current) {
      // create temporary canvas at old size and scale it
      const temp = document.createElement("canvas");
      temp.width = current.width;
      temp.height = current.height;
      const tctx = temp.getContext("2d")!;
      tctx.putImageData(current, 0, 0);

      resetTransform(ctx);
      ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
      applyScale(ctx);
    } else {
      drawPaper(ctx);
      saveState();
    }
  }, [drawPaper, saveState]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // ---------- Drawing ----------
  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
      pressure: e.pressure > 0 ? e.pressure : 0.5,
    };
  };

  const setStyle = (ctx: CanvasRenderingContext2D, pressure: number) => {
    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      const r = parseInt(currentColor.slice(1, 3), 16);
      const g = parseInt(currentColor.slice(3, 5), 16);
      const b = parseInt(currentColor.slice(5, 7), 16);
      ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
    }

    let size = currentSize;
    if (pressureSensitivity) {
      size = Math.max(1.5, currentSize * (0.25 + pressure * 1.6));
    }
    // Eraser is a bit larger for better feel
    if (activeTool === "eraser") size *= 1.6;

    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;

    const pos = getPos(e);
    lastPos.current = { x: pos.x, y: pos.y };

    const ctx = getCtx();
    if (!ctx) return;

    applyScale(ctx);
    setStyle(ctx, pos.pressure);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const move = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();

    const pos = getPos(e);
    const ctx = getCtx();
    if (!ctx) return;

    setStyle(ctx, pos.pressure);

    if (smoothing) {
      const midX = (lastPos.current.x + pos.x) / 2;
      const midY = (lastPos.current.y + pos.y) / 2;
      ctx.quadraticCurveTo(lastPos.current.x, lastPos.current.y, midX, midY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(midX, midY);
    } else {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    lastPos.current = { x: pos.x, y: pos.y };
  };

  const end = (e?: React.PointerEvent) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (e) {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    }

    const ctx = getCtx();
    if (ctx) {
      ctx.globalCompositeOperation = "source-over";
    }
    saveState();
  };

  // ---------- Public API ----------
  useImperativeHandle(ref, () => ({
    undo: () => {
      if (historyIndex.current > 0) {
        restoreState(historyIndex.current - 1);
      }
    },
    redo: () => {
      if (historyIndex.current < history.current.length - 1) {
        restoreState(historyIndex.current + 1);
      }
    },
    clear: () => {
      const ctx = getCtx();
      if (!ctx) return;
      drawPaper(ctx);
      saveState();
    },
    save: (name: string, format: string, transparent: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const mime =
        format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
      const quality = format === "png" ? 1 : 0.92;

      // Create clean export canvas
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ectx = exportCanvas.getContext("2d")!;

      if (!transparent || format !== "png") {
        ectx.fillStyle = "#ffffff";
        ectx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }

      ectx.drawImage(canvas, 0, 0);

      const link = document.createElement("a");
      link.download = `${name}.${format}`;
      link.href = exportCanvas.toDataURL(mime, quality);
      link.click();
    },
    toggleFullscreen: () => {
      const el = containerRef.current;
      if (!el) return;
      if (!document.fullscreenElement) {
        el.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    },
    changePaperStyle: (style: PaperStyle) => {
      // paperStyle is controlled from parent, just redraw
      const ctx = getCtx();
      if (!ctx) return;
      // keep drawing by restoring last state after paper change
      const last = history.current[historyIndex.current];
      drawPaper(ctx);
      if (last) {
        // We need to composite only the ink, but for simplicity we clear
        // (same behaviour as original)
      }
      saveState();
    },
    setGuideLines: (v: boolean) => {
      // parent already updated the prop, force redraw of paper
      const ctx = getCtx();
      if (!ctx) return;
      const last = history.current[historyIndex.current];
      if (last) {
        resetTransform(ctx);
        ctx.putImageData(last, 0, 0);
        applyScale(ctx);
      }
    },
  }));

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (historyIndex.current > 0) restoreState(historyIndex.current - 1);
      }
      if ((mod && e.shiftKey && e.key === "Z") || (mod && e.key === "y")) {
        e.preventDefault();
        if (historyIndex.current < history.current.length - 1)
          restoreState(historyIndex.current + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [restoreState]);

  return (
    <div
      ref={containerRef}
      className="relative border rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-[80vh] cursor-crosshair touch-none block"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
      />

      {/* Guide text overlay */}
      {guideText && (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.12] text-zinc-500 z-10 select-none"
          style={{
            fontSize: `min(35vw, 280px)`,
            fontFamily: "'Noto Serif Bengali', 'Noto Sans Bengali', serif",
          }}
        >
          {guideText}
        </div>
      )}
    </div>
  );
});

export default DrawingCanvas;