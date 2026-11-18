import { ADSENSE_CLIENT } from "@/lib/adsense";

/**
 * Load AdSense only on demand from an eligible, explicitly opted-in AdUnit.
 * A root-layout loader could permit Auto ads on private, utility, filter, or
 * other ineligible pages.
 */
export function loadAdSense(clientId?: string) {
  const effectiveClient = clientId || ADSENSE_CLIENT;
  if (
    typeof document === "undefined" ||
    !/^ca-pub-\d{16}$/.test(effectiveClient ?? "") ||
    document.querySelector("script[data-totthobox-adsense]")
  ) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + effectiveClient;
  script.crossOrigin = "anonymous";
  script.dataset.totthoboxAdsense = "1";
  document.head.appendChild(script);
}
