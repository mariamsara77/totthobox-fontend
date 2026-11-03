"use client";

import DeferredAdSense from "./DeferredAdSense";
import AdUnit from "./AdUnit";

export { AdUnit, DeferredAdSense };

export default function Adsense(props: React.ComponentProps<typeof AdUnit>) {
  if (props.slotId || props.format) {
    return <AdUnit {...props} />;
  }
  return <DeferredAdSense />;
}
