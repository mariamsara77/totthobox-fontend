"use client";

import { useEffect } from "react";
import { track404View } from "@/lib/analytics";

export default function Track404() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      track404View(window.location.pathname);
    }
  }, []);

  return null;
}
