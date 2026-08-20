import React, { Suspense } from "react";
import AdvancedBanglaCalendar from "./AdvancedBanglaCalendar"; // আপনার ফাইলের সঠিক Path দিন

export default function BanglaCalendarPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto p-4 space-y-6 animate-pulse">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-3/4"></div>
          <div className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>
      }
    >
      <AdvancedBanglaCalendar />
    </Suspense>
  );
}