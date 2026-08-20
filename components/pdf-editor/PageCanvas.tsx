"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePdfEditorStore } from "./store";
import { Annotation } from "./types";

interface Props {
  pageNumber: number;
}

export function PageCanvas({ pageNumber }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const {
    pdfDoc,
    scale,
    tool,
    pages,
    selectedId,
    setSelectedId,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
  } = usePdfEditorStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isRendering, setIsRendering] = useState(false);

  const [highlightStart, setHighlightStart] = useState<{ x: number; y: number } | null>(null);
  const [highlightCurrent, setHighlightCurrent] = useState<{ x: number; y: number } | null>(null);

  const [dragMode, setDragMode] = useState<"move" | "resize" | "rotate" | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [originalAnn, setOriginalAnn] = useState<Annotation | null>(null);

  const pageIndex = pageNumber - 1;
  const pageState = pages[pageIndex];

  // Safe PDF Render
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
          renderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const rotation = pageState?.rotation || 0;
        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
        if (!cancelled) renderTaskRef.current = null;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(err);
        }
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    };

    renderPage();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, pageNumber, scale, pageState?.rotation]);

  // Auto focus text
  useEffect(() => {
    if (selectedId && textInputRef.current) {
      const ann = pageState?.annotations.find((a) => a.id === selectedId);
      if (ann?.type === "text") {
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 50);
      }
    }
  }, [selectedId]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedId &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        removeAnnotation(selectedId);
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, removeAnnotation, setSelectedId]);

  const getPos = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const rect = overlayRef.current!.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      };
    },
    [scale]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e);

    if (tool === "select") {
      setSelectedId(null);
      return;
    }

    if (tool === "text") {
      const id = crypto.randomUUID();
      addAnnotation({
        id,
        pageIndex,
        type: "text",
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 40,
        text: "",
        fontSize: 18,
        color: "#111827",
        rotation: 0,
      });
      return;
    }

    if (tool === "highlight") {
      setHighlightStart(pos);
      setHighlightCurrent(pos);
      return;
    }

    if (tool === "draw" || tool === "signature") {
      setIsDrawing(true);
      setCurrentPath([pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getPos(e);

    if (tool === "highlight" && highlightStart) {
      setHighlightCurrent(pos);
      return;
    }

    if (isDrawing) {
      setCurrentPath((prev) => [...prev, pos]);
      return;
    }

    if (dragMode && selectedId && originalAnn && dragStart) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;

      if (dragMode === "move") {
        updateAnnotation(selectedId, {
          x: originalAnn.x + dx,
          y: originalAnn.y + dy,
        });
      }

      if (dragMode === "resize" && originalAnn.width && originalAnn.height) {
        updateAnnotation(selectedId, {
          width: Math.max(40, originalAnn.width + dx),
          height: Math.max(24, originalAnn.height + dy),
        });
      }

      if (dragMode === "rotate") {
        const centerX = originalAnn.x + (originalAnn.width || 50) / 2;
        const centerY = originalAnn.y + (originalAnn.height || 20) / 2;
        const angle =
          Math.atan2(pos.y - centerY, pos.x - centerX) * (180 / Math.PI);
        updateAnnotation(selectedId, {
          rotation: Math.round(angle),
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (tool === "highlight" && highlightStart && highlightCurrent) {
      const x = Math.min(highlightStart.x, highlightCurrent.x);
      const y = Math.min(highlightStart.y, highlightCurrent.y);
      const width = Math.abs(highlightCurrent.x - highlightStart.x);
      const height = Math.abs(highlightCurrent.y - highlightStart.y);

      if (width > 8 && height > 8) {
        addAnnotation({
          id: crypto.randomUUID(),
          pageIndex,
          type: "highlight",
          x,
          y,
          width,
          height,
          color: "#fef08a",
          opacity: 0.45,
          rotation: 0,
        });
      }
      setHighlightStart(null);
      setHighlightCurrent(null);
      return;
    }

    if (isDrawing && currentPath.length > 2) {
      addAnnotation({
        id: crypto.randomUUID(),
        pageIndex,
        type: tool === "signature" ? "signature" : "draw",
        x: 0,
        y: 0,
        path: currentPath,
        color: tool === "signature" ? "#1e40af" : "#e11d48",
        strokeWidth: tool === "signature" ? 3 : 2.5,
      });
    }

    setIsDrawing(false);
    setCurrentPath([]);
    setDragMode(null);
    setDragStart(null);
    setOriginalAnn(null);
  };

  const onAnnMouseDown = (
    e: React.MouseEvent,
    ann: Annotation,
    mode: "move" | "resize" | "rotate" = "move"
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (tool === "eraser") {
      removeAnnotation(ann.id);
      return;
    }

    setSelectedId(ann.id);
    setDragMode(mode);
    setDragStart(getPos(e));
    setOriginalAnn({ ...ann });
  };

  return (
    <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white select-none">
      {isRendering && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60">
          <div className="size-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <canvas ref={canvasRef} className="block" />

      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          cursor:
            tool === "draw" || tool === "signature" || tool === "highlight"
              ? "crosshair"
              : tool === "text"
              ? "text"
              : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {pageState?.annotations.map((ann) => (
          <AnnotationRenderer
            key={ann.id}
            ann={ann}
            scale={scale}
            isSelected={selectedId === ann.id}
            onMouseDown={onAnnMouseDown}
            textInputRef={selectedId === ann.id ? textInputRef : undefined}
            updateAnnotation={updateAnnotation}
          />
        ))}

        {highlightStart && highlightCurrent && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: Math.min(highlightStart.x, highlightCurrent.x) * scale,
              top: Math.min(highlightStart.y, highlightCurrent.y) * scale,
              width: Math.abs(highlightCurrent.x - highlightStart.x) * scale,
              height: Math.abs(highlightCurrent.y - highlightStart.y) * scale,
              backgroundColor: "#fef08a",
              opacity: 0.4,
            }}
          />
        )}

        {isDrawing && currentPath.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points={currentPath
                .map((p) => `${p.x * scale},${p.y * scale}`)
                .join(" ")}
              fill="none"
              stroke={tool === "signature" ? "#1e40af" : "#e11d48"}
              strokeWidth={tool === "signature" ? 3 : 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

function AnnotationRenderer({
  ann,
  scale,
  isSelected,
  onMouseDown,
  textInputRef,
  updateAnnotation,
}: {
  ann: Annotation;
  scale: number;
  isSelected: boolean;
  onMouseDown: (
    e: React.MouseEvent,
    ann: Annotation,
    mode?: "move" | "resize" | "rotate"
  ) => void;
  textInputRef?: React.RefObject<HTMLTextAreaElement | null>;
  updateAnnotation: (id: string, data: Partial<Annotation>) => void;
}) {
  const rotation = ann.rotation || 0;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: ann.x * scale,
    top: ann.y * scale,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: "center center",
  };

  if (ann.type === "text") {
    return (
      <div
        style={{
          ...baseStyle,
          width: (ann.width || 200) * scale,
          minHeight: (ann.height || 36) * scale,
        }}
        className="group"
      >
        <textarea
          ref={textInputRef as any}
          value={ann.text || ""}
          onChange={(e) => updateAnnotation(ann.id, { text: e.target.value })}
          onMouseDown={(e) => onMouseDown(e, ann, "move")}
          placeholder="Type here..."
          className="w-full h-full bg-transparent resize-none outline-none border-none p-1"
          style={{
            fontSize: (ann.fontSize || 18) * scale,
            color: ann.color || "#111827",
            lineHeight: 1.3,
            cursor: isSelected ? "move" : "text",
          }}
        />

        {isSelected && (
          <SelectionBox
            width={(ann.width || 200) * scale}
            height={(ann.height || 36) * scale}
            onResize={(e) => onMouseDown(e, ann, "resize")}
            onRotate={(e) => onMouseDown(e, ann, "rotate")}
          />
        )}
      </div>
    );
  }

  if (ann.type === "highlight") {
    return (
      <div
        style={{
          ...baseStyle,
          width: (ann.width || 100) * scale,
          height: (ann.height || 20) * scale,
          backgroundColor: ann.color || "#fef08a",
          opacity: ann.opacity || 0.45,
          cursor: "move",
        }}
        onMouseDown={(e) => onMouseDown(e, ann, "move")}
      >
        {isSelected && (
          <SelectionBox
            width={(ann.width || 100) * scale}
            height={(ann.height || 20) * scale}
            onResize={(e) => onMouseDown(e, ann, "resize")}
            onRotate={(e) => onMouseDown(e, ann, "rotate")}
          />
        )}
      </div>
    );
  }

  if ((ann.type === "draw" || ann.type === "signature") && ann.path) {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <polyline
          points={ann.path
            .map((p) => `${p.x * scale},${p.y * scale}`)
            .join(" ")}
          fill="none"
          stroke={ann.color || "#e11d48"}
          strokeWidth={(ann.strokeWidth || 2.5) * scale}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-auto"
          style={{ cursor: "move" }}
          onMouseDown={(e) => onMouseDown(e as any, ann, "move")}
        />
      </svg>
    );
  }

  return null;
}

function SelectionBox({
  width,
  height,
  onResize,
  onRotate,
}: {
  width: number;
  height: number;
  onResize: (e: React.MouseEvent) => void;
  onRotate: (e: React.MouseEvent) => void;
}) {
  return (
    <>
      <div
        className="absolute border-2 border-indigo-500 pointer-events-none"
        style={{ left: -2, top: -2, width: width + 4, height: height + 4 }}
      />
      <div
        onMouseDown={onResize}
        className="absolute size-3.5 bg-white border-2 border-indigo-500 rounded-sm cursor-se-resize shadow"
        style={{ right: -7, bottom: -7 }}
      />
      <div
        onMouseDown={onRotate}
        className="absolute size-3.5 bg-indigo-500 rounded-full cursor-grab shadow"
        style={{ left: width / 2 - 7, top: -30 }}
        title="Rotate"
      />
      <div
        className="absolute w-0.5 bg-indigo-400 pointer-events-none"
        style={{ left: width / 2 - 1, top: -24, height: 18 }}
      />
    </>
  );
}