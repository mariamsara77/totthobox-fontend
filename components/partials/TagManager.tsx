"use client";

import { useEffect } from "react";

type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_EVENT = "totthobox:consent-updated";

function readConsent(): ConsentPreferences | null {
  try {
    const raw = window.localStorage.getItem("cookie_consent");
    if (!raw) return null;

    const saved = JSON.parse(raw) as Record<string, unknown>;
    if (
      typeof saved.analytics !== "boolean" ||
      typeof saved.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      analytics: saved.analytics,
      marketing: saved.marketing,
    };
  } catch {
    return null;
  }
}

export function applyConsent(preferences: ConsentPreferences | null) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      // Ensure dataLayer receives standard arguments object required by GTM/GA4
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

  const analytics = preferences?.analytics === true;
  const marketing = preferences?.marketing === true;

  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });

  window.dataLayer.push({
    event: "consent_update",
    consent_analytics: analytics,
    consent_marketing: marketing,
  });
}

export default function TagManager() {
  useEffect(() => {
    // Sync current preferences with Consent Mode v2 on mount
    const saved = readConsent();
    if (saved) {
      applyConsent(saved);
    }

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      applyConsent(customEvent.detail ?? readConsent());
    };

    window.addEventListener(CONSENT_EVENT, handleConsentUpdate);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handleConsentUpdate);
    };
  }, []);

  return null;
}
