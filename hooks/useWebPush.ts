"use client";

import { useEffect, useState, useCallback } from "react";
import { urlBase64ToUint8Array } from "@/lib/pwa/webpush";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

export function useWebPush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (sub) {
            setSubscription(sub);
          }
        })
        .catch((err) => {
          console.warn("[WebPush] Failed to inspect subscription:", err);
        });
    }
  }, []);

  const subscribeToPush = useCallback(async () => {
    if (!isSupported) return false;
    setLoading(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setLoading(false);
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      setSubscription(sub);

      // Send subscription to server endpoint
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      setLoading(false);
      return true;
    } catch (err) {
      console.error("[WebPush] Subscription error:", err);
      setLoading(false);
      return false;
    }
  }, [isSupported]);

  const unsubscribeFromPush = useCallback(async () => {
    if (!subscription) return false;
    setLoading(true);

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("[WebPush] Unsubscribe error:", err);
      setLoading(false);
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    subscription,
    permission,
    loading,
    subscribeToPush,
    unsubscribeFromPush,
  };
}
