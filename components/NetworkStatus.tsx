"use client";

import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-red-600 text-white text-xs text-center py-1 font-medium fixed top-0 left-0 right-0 z-50">
      আপনি বর্তমানে অফলাইনে আছেন। কিছু তথ্য আপডেট নাও হতে পারে।
    </div>
  );
}
