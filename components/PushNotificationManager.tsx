"use client";

import { useCallback, useState } from "react";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export default function PushNotificationManager() {
  const [status, setStatus] = useState<"idle" | "loading" | "enabled" | "unsupported" | "error">("idle");

  const enablePush = useCallback(async () => {
    setStatus("loading");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setStatus("error");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing ?? await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (!response.ok) throw new Error("Subscription endpoint rejected the request");
      setStatus("enabled");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.warn("Push setup failed:", error);
      setStatus("error");
    }
  }, []);

  return (
    <button type="button" onClick={enablePush} disabled={status === "loading" || status === "enabled"}>
      {status === "loading" ? "নোটিফিকেশন চালু হচ্ছে…" : status === "enabled" ? "নোটিফিকেশন চালু আছে" : "নোটিফিকেশন চালু করুন"}
    </button>
  );
}
