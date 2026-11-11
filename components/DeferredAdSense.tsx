/**
 * Load AdSense only on demand from an eligible, explicitly opted-in AdUnit.
 * A root-layout loader could permit Auto ads on private, utility, filter, or
 * other ineligible pages.
 */
export function loadAdSense(clientId?: string) {
  if (
    typeof document === "undefined" ||
    !/^ca-pub-\\d{16}$/.test(clientId ?? "") ||
    document.querySelector("script[data-totthobox-adsense=1]")
  ) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + clientId;
  script.crossOrigin = "anonymous";
  script.dataset.totthoboxAdsense = "1";
  document.head.appendChild(script);
}
