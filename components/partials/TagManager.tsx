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
    __totthoboxConsentDefaultsSet?: boolean;
    __totthoboxGA4Initialized?: boolean;
    __totthoboxGTMInitialized?: boolean;
  }
}

const ANALYTICS_ID = "G-HGE2T2J8ZT";
const GTM_ID = "GTM-5RFHKJJJ";
const CONSENT_EVENT = "totthobox:consent-updated";

function readConsent(): ConsentPreferences | null {
  try {
    const raw = window.localStorage.getItem("cookie_consent");
    if (!raw) return null;

    const saved = JSON.parse(raw) as Record<string, unknown>;
    if (typeof saved.analytics !== "boolean" || typeof saved.marketing !== "boolean") {
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

function ensureGoogleQueue() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!window.__totthoboxConsentDefaultsSet) {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
    window.gtag("set", "ads_data_redaction", true);
    window.__totthoboxConsentDefaultsSet = true;
  }
}

function loadGoogleTagManager() {
  if (window.__totthoboxGTMInitialized) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const existing = document.querySelector(
    'script[src*="googletagmanager.com/gtm.js"]',
  );
  if (!existing) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.dataset.totthoboxGtm = "1";
    document.head.appendChild(script);
  }

  window.__totthoboxGTMInitialized = true;
}

function loadGoogleAnalytics() {
  ensureGoogleQueue();

  if (!window.__totthoboxGA4Initialized) {
    window.gtag?.("js", new Date());
    window.gtag?.("config", ANALYTICS_ID);
    window.__totthoboxGA4Initialized = true;
  }

  const existing = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]',
  );
  if (existing) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  script.dataset.totthoboxAnalytics = "1";
  document.head.appendChild(script);
}

function applyConsent(preferences: ConsentPreferences | null) {
  ensureGoogleQueue();

  const analytics = preferences?.analytics === true;
  const marketing = preferences?.marketing === true;

  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });

  if (analytics) {
    loadGoogleAnalytics();
    // GTM may contain analytics or custom tags; don't execute the container
    // for marketing-only consent. AdSense loads separately via its own gate.
    loadGoogleTagManager();
  }
}

export default function TagManager() {
  useEffect(() => {
    // No saved choice means optional analytics and marketing remain disabled.
    applyConsent(readConsent());

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      applyConsent(customEvent.detail ?? readConsent());
    };

    window.addEventListener(CONSENT_EVENT, handleConsentUpdate);
    return () => window.removeEventListener(CONSENT_EVENT, handleConsentUpdate);
  }, []);

  return null;
}
