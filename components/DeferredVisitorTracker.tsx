"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const VisitorTracker = dynamic(() => import("@/components/VisitorTracker"), {
  ssr: false,
});

function scheduleIdle(callback: () => void) {
  const requestIdle = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
    }
  ).requestIdleCallback;

  if (requestIdle) return requestIdle(callback, { timeout: 8000 });
  return window.setTimeout(callback, 3500);
}

function cancelIdle(handle: number) {
  const cancelIdle = (
    window as Window & {
      cancelIdleCallback?: (handle: number) => void;
    }
  ).cancelIdleCallback;

  if (cancelIdle) cancelIdle(handle);
  else window.clearTimeout(handle);
}

export default function DeferredVisitorTracker() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleHandle = 0;

    const handleLoad = () => {
      idleHandle = scheduleIdle(() => setReady(true));
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      if (idleHandle) cancelIdle(idleHandle);
    };
  }, []);

  if (!ready) return null;
  return <VisitorTracker />;
}
