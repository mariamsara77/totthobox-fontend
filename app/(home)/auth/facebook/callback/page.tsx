import { Suspense } from "react";
import FacebookCallbackContent from "./FacebookCallbackContent";

export const dynamic = 'force-dynamic';

export default function FacebookCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-300">লোড হচ্ছে...</p>
          </div>
        </div>
      }
    >
      <FacebookCallbackContent />
    </Suspense>
  );
}