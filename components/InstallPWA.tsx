"use client";

import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getBrowserName(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("samsungbrowser")) return "Samsung Internet";
  if (ua.includes("edg/")) return "Microsoft Edge";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("crios")) return "Chrome";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome")) return "Safari";
  return "আপনার ব্রাউজার";
}

function showInstallGuide(): void {
  const browser = getBrowserName();
  if (browser === "Safari") {
    toast("Safari: Share → Add to Home Screen নির্বাচন করুন।", { duration: 7000 });
    return;
  }
  toast(`${browser}: Browser Menu খুলে “Install app” বা “Add to Home screen” নির্বাচন করুন।`, { duration: 7000 });
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const clearLegacyPrivateCaches = async () => {
      if (!("serviceWorker" in navigator) || !("caches" in window)) return;
      try {
        await navigator.serviceWorker.ready;
        const legacyCacheNames = new Set(["pages", "pages-rsc", "pages-rsc-prefetch", "apis", "cross-origin", "start-url", "next-data", "static-data-assets"]);
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.filter((name) => legacyCacheNames.has(name)).map((name) => caches.delete(name)));
      } catch {
        // Cache cleanup is best-effort and must never block the app UI.
      }
    };
    void clearLegacyPrivateCaches();

    const syncState = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice || window.innerWidth < 768);
      setInstalled(isStandalone());
    };
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    syncState();
    window.addEventListener("resize", syncState);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("resize", syncState);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      showInstallGuide();
      return;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
    } finally {
      setDeferredPrompt(null);
    }
  };

  // Desktop browsers can install too; don't hide the native prompt just because
  // the device isn't touch-enabled. Keep the manual guide for mobile browsers.
  if (installed || (!isMobile && !deferredPrompt)) return null;

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className="tb-button tb-button-primary pwa-fixed-bottom fixed right-4 z-50 shadow-lg transition hover:scale-105"
      aria-label="Totthobox অ্যাপ ইনস্টল করুন"
    >
      <Smartphone size={16} strokeWidth={2.2} />
      অ্যাপ ইনস্টল করুন
    </button>
  );
}
