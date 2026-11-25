"use client";

import dynamic from "next/dynamic";

const VisitorTracker = dynamic(() => import("@/components/analytics/VisitorTracker"), {
  ssr: false,
});

export default function DeferredVisitorTracker() {
  return <VisitorTracker />;
}
