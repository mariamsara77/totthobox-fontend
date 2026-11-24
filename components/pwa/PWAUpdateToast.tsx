"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function PWAUpdateToast() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleUpdate = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdate(true);
      }
    };

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        handleUpdate(reg);

        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (installing) {
            installing.addEventListener("statechange", () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(installing);
                setShowUpdate(true);
              }
            });
          }
        });
      }
    });

    // Workbox window listener if loaded
    const onWaiting = () => {
      setShowUpdate(true);
    };
    window.addEventListener("workbox-waiting" as any, onWaiting);

    return () => {
      window.removeEventListener("workbox-waiting" as any, onWaiting);
    };
  }, []);

  const handleApplyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setShowUpdate(false);
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-primary-500/30 bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded-xl bg-primary-500/20 text-primary-400 dark:text-primary-600 flex items-center justify-center shrink-0">
          <ArrowPathIcon className="size-4 animate-spin stroke-2" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">নতুন সংস্করণ উপলব্ধ!</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
            হালনাগাদ ফিচার পেতে রিলোড করুন
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleApplyUpdate}
          className="rounded-lg bg-primary-600 hover:bg-primary-700 text-white px-2.5 py-1 text-xs font-semibold transition-colors shadow-xs"
        >
          আপডেট করুন
        </button>
        <button
          type="button"
          onClick={() => setShowUpdate(false)}
          aria-label="বিজ্ঞপ্তি বন্ধ করুন"
          className="p-1 rounded-lg text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors"
        >
          <XMarkIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
