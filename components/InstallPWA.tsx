"use client";

import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile check
    const checkMobile = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("resize", checkMobile);
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

  // শুধু Mobile + Installable হলে দেখাবে
  if (!isInstallable || !isMobile) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:scale-105 dark:bg-white dark:text-black"
    >
      <Smartphone size={16} strokeWidth={2.2} />
      অ্যাপ ইনস্টল করুন
    </button>
  );
}
