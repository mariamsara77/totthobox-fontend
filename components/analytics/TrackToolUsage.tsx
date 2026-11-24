"use client";

import { useEffect } from "react";
import { trackToolUsed, trackConverterUsed } from "@/lib/analytics";

interface TrackToolUsageProps {
  title: string;
}

export default function TrackToolUsage({ title }: TrackToolUsageProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isConverter = window.location.pathname.includes("/converter");
      if (isConverter) {
        trackConverterUsed(title);
      } else {
        trackToolUsed(title);
      }
    }
  }, [title]);

  return null;
}
