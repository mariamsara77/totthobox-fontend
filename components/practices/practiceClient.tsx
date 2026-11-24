"use client";

import { useCallback, useRef, useState } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import FloatingToolbar from "./FloatingToolbar";
import SettingsPanel from "./SettingsPanel";
import { ClearModal, SaveModal, HelpModal } from "./Modals";

export type Tool = "pen" | "eraser";
export type PaperStyle =
  | "blank"
  | "lined"
  | "grid"
  | "graph"
  | "yellow"
  | "parchment";
export type SaveFormat = "png" | "jpeg" | "webp";

export default function PracticeClient() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);

  const [activeTool, setActiveTool] = useState<Tool>("pen");
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentSize, setCurrentSize] = useState(6);
  const [opacity, setOpacity] = useState(1);

  const [guideText, setGuideText] = useState("");
  const [currentPaperStyle, setCurrentPaperStyle] =
    useState<PaperStyle>("blank");
  const [pressureSensitivity, setPressureSensitivity] = useState(true);
  const [smoothing, setSmoothing] = useState(true);
  const [guideLines, setGuideLines] = useState(true);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [fileName, setFileName] = useState(
    `Totthobox-writing-practice-${new Date().toISOString().slice(0, 10)}`,
  );
  const [saveFormat, setSaveFormat] = useState<SaveFormat>("png");
  const [transparentBg, setTransparentBg] = useState(false);

  const handleHistoryChange = useCallback((undo: boolean, redo: boolean) => {
    setCanUndo(undo);
    setCanRedo(redo);
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            লেখা প্র্যাকটিস
          </h1>
          <p className="hidden sm:block text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            উন্নত ড্রয়িং এবং রাইটিং টুল — বাংলা ও ইংরেজি অক্ষর প্র্যাকটিস করুন
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHelp(true)}
            className="size-10 flex items-center justify-center rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 text-zinc-500 transition"
            title="সাহায্য"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </button>

          <button
            onClick={() => canvasRef.current?.toggleFullscreen()}
            className="size-10 flex items-center justify-center rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 text-zinc-500 transition"
            title="ফুলস্ক্রিন"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Canvas + Toolbar */}
      <div className="relative">
        <DrawingCanvas
          ref={canvasRef}
          activeTool={activeTool}
          currentColor={currentColor}
          currentSize={currentSize}
          opacity={opacity}
          guideText={guideText}
          paperStyle={currentPaperStyle}
          pressureSensitivity={pressureSensitivity}
          smoothing={smoothing}
          guideLines={guideLines}
          onHistoryChange={handleHistoryChange}
        />

        <FloatingToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => canvasRef.current?.undo()}
          onRedo={() => canvasRef.current?.redo()}
          onSave={() => setShowSave(true)}
          onClear={() => setShowClear(true)}
          onSettings={() => setShowSettings(true)}
        />
      </div>

      {/* SEO Content */}
      <section className="space-y-4 pt-6 border-t border-zinc-400/20">
        <h2 className="text-xl font-bold">
          লেখা প্র্যাকটিস টুল কীভাবে ব্যবহার করবেন?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          এই টুল দিয়ে আপনি বাংলা ও ইংরেজি অক্ষরের হাতের লেখা প্র্যাকটিস করতে
          পারবেন। সেটিংস থেকে প্র্যাকটিস ক্যারেক্টার বেছে নিন, পেপার স্টাইল
          পরিবর্তন করুন এবং গাইড লাইন চালু করে সঠিক এলাইনমেন্টে লিখুন। শিশুদের
          হাতের লেখা উন্নত করতে এবং ডিজিটাল ড্রয়িংয়ের জন্য এটি খুবই উপযোগী।
        </p>
      </section>

      {/* Panels & Modals */}
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        currentSize={currentSize}
        onSizeChange={setCurrentSize}
        opacity={opacity}
        onOpacityChange={setOpacity}
        guideText={guideText}
        onGuideTextChange={setGuideText}
        paperStyle={currentPaperStyle}
        onPaperStyleChange={(style) => {
          setCurrentPaperStyle(style);
          canvasRef.current?.changePaperStyle(style);
        }}
        pressureSensitivity={pressureSensitivity}
        onPressureChange={setPressureSensitivity}
        smoothing={smoothing}
        onSmoothingChange={setSmoothing}
        guideLines={guideLines}
        onGuideLinesChange={(v) => {
          setGuideLines(v);
          canvasRef.current?.setGuideLines(v);
        }}
      />

      <ClearModal
        open={showClear}
        onClose={() => setShowClear(false)}
        onConfirm={() => {
          canvasRef.current?.clear();
          setShowClear(false);
        }}
      />

      <SaveModal
        open={showSave}
        onClose={() => setShowSave(false)}
        fileName={fileName}
        onFileNameChange={setFileName}
        saveFormat={saveFormat}
        onFormatChange={setSaveFormat}
        transparentBg={transparentBg}
        onTransparentChange={setTransparentBg}
        onSave={() => {
          canvasRef.current?.save(fileName, saveFormat, transparentBg);
          setShowSave(false);
        }}
      />

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
