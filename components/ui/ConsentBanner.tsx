"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./Button";
import Icon from "./Icon";

export function ConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const consentGiven = localStorage.getItem("totthobox_cookie_consent");
      if (!consentGiven) {
        setIsOpen(true);
      }
    } catch {
      // ignore in incognito
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("totthobox_cookie_consent", "all");
    } catch {}
    setIsOpen(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("totthobox_cookie_consent", "essential");
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="কুকি ও গোপনীয়তা সম্মতি"
      className="fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-4 sm:right-auto sm:max-w-md z-50 p-4 sm:p-5 rounded-none sm:rounded-xl border-t sm:border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-ink)]">
          <Icon name="Cookie" size="sm" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            আপনার গোপনীয়তা ও কুকি সম্মতি
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            আমরা প্ল্যাটফর্মের মানোন্নয়ন ও সুরক্ষিত অভিজ্ঞতার জন্য প্রয়োজনীয় কুকি ব্যবহার করি। বিস্তারিত জানুন আমাদের{" "}
            <Link
              href="/privacy-policy"
              className="text-[var(--accent-ink)] hover:underline font-medium"
            >
              গোপনীয়তা নীতি
            </Link>{" "}
            পেজে।
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button variant="primary" size="sm" fullWidth onClick={handleAcceptAll}>
          সম্মতি দিন
        </Button>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleEssentialOnly}
        >
          শুধু প্রয়োজনীয়
        </Button>
      </div>
    </aside>
  );
}

export default ConsentBanner;
