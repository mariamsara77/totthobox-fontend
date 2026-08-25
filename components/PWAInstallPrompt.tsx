"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", () => setVisible(false));

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  if (!visible || !installEvent) return null;

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);

    if (choice.outcome === "dismissed") return;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-2xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-lg dark:bg-zinc-800">
          📱
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Totthobox অ্যাপ ইনস্টল করুন</p>
          <p className="text-xs text-zinc-500">দ্রুত অ্যাক্সেস ও অ্যাপের মতো অভিজ্ঞতা</p>
        </div>
        <button
          type="button"
          onClick={install}
          className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900"
        >
          ইনস্টল
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="বন্ধ করুন"
          className="shrink-0 rounded-lg p-2 text-zinc-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
