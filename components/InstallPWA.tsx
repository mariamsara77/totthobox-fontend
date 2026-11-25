"use client";

import { Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in this session
    if (sessionStorage.getItem("pwa_dismissed") === "1") {
      setDismissed(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsInstallable(false);
    setDismissed(true);
    try {
      sessionStorage.setItem("pwa_dismissed", "1");
    } catch {}
  };

  // Only show if installable and not dismissed
  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 flex items-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg border border-zinc-700 dark:border-zinc-300 transition-opacity duration-200">
      <button
        onClick={handleInstallClick}
        className="flex min-h-11 items-center gap-2 pl-4 pr-2 py-2 text-xs font-medium"
      >
        <Smartphone size={16} strokeWidth={2.2} />
        <span>অ্যাপ ইনস্টল করুন</span>
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="বিজ্ঞপ্তি বন্ধ করুন"
        className="flex min-h-11 min-w-10 items-center justify-center pr-2.5 text-zinc-400 dark:text-zinc-600 hover:text-white dark:hover:text-black transition"
      >
        <X size={15} />
      </button>
    </div>
  );
}
