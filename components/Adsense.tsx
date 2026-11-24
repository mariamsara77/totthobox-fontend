"use client";

import AdUnit from "./AdUnit";

export { AdUnit };

export default function Adsense(props: React.ComponentProps<typeof AdUnit>) {
  // Legacy callers must opt in explicitly; a missing slot never loads AdSense.
  if (!props.enabled || !props.eligible || !props.slotId || !props.clientId) {
    return null;
  }

  return <AdUnit {...props} />;
}
