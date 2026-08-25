"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;
    let disposed = false;

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        if (disposed) return;

        const checkForUpdate = () => registration?.update().catch(() => undefined);
        checkForUpdate();

        const onVisibilityChange = () => {
          if (document.visibilityState === "visible") checkForUpdate();
        };

        const onControllerChange = () => {
          if (!disposed) window.location.reload();
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        navigator.serviceWorker.addEventListener("controllerchange", onControllerChange, { once: true });

        registration.addEventListener("updatefound", () => {
          const worker = registration?.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              worker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });

        return () => {
          document.removeEventListener("visibilitychange", onVisibilityChange);
        };
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("PWA service worker registration failed:", error);
        }
      }
    };

    const cleanupPromise = register();

    return () => {
      disposed = true;
      cleanupPromise.then((cleanup) => cleanup?.()).catch(() => undefined);
    };
  }, []);

  return null;
}
