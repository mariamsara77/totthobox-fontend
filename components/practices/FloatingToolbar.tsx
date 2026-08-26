"use client";

import type { Tool } from "./practiceClient";

interface Props {
  activeTool: Tool;
  onToolChange: (t: Tool) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onClear: () => void;
  onSettings: () => void;
}

export default function FloatingToolbar({
  activeTool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onClear,
  onSettings,
}: Props) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 p-2 rounded-2xl border border-zinc-400/25 dark:border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 backdrop-blur-md ">
        {/* Pen */}
        <button
          onClick={() => onToolChange("pen")}
          className={`size-12 flex items-center justify-center rounded-xl transition ${
            activeTool === "pen" ? "bg-zinc-400/25 text-white" : "text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
          }`}
          title="Pen"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001" />
          </svg>
        </button>

        {/* Eraser */}
        <button
          onClick={() => onToolChange("eraser")}
          className={`size-12 flex items-center justify-center rounded-xl transition ${
            activeTool === "eraser" ? "bg-zinc-400/25 text-white" : "text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
          }`}
          title="Eraser"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z" />
          </svg>
        </button>

        <div className="w-px h-7 bg-zinc-400/25 bg-zinc-400/10 mx-1" />

        <button onClick={onUndo} disabled={!canUndo} className="size-12 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25 disabled:opacity-35 transition" title="Undo">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </button>

        <button onClick={onRedo} disabled={!canRedo} className="size-12 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25 disabled:opacity-35 transition" title="Redo">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
          </svg>
        </button>

        <div className="w-px h-7 bg-zinc-400/25 bg-zinc-400/10 mx-1" />

        <button onClick={onSave} className="size-12 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25 transition" title="Save">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>

        <button onClick={onClear} className="size-12 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25 transition" title="Clear">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>

        <button onClick={onSettings} className="size-12 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/25 transition" title="Settings">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}