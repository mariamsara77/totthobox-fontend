"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export default function PushNotificationManager() {
  const [status, setStatus] = useState<"idle" | "loading" | "enabled" | "unsupported">("idle");

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;
    setStatus("loading");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") { setStatus("idle"); return; }
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(subscription),
    });
    setStatus("enabled");
  }

  return (
    <button type="button" onClick={enablePush} disabled={status === "loading" || status === "enabled"}>
      {status === "enabled" ? "নোটিফিকেশন চালু আছে" : status === "loading" ? "চালু হচ্ছে…" : "নোটিফিকেশন চালু করুন"}
    </button>
  );
}
