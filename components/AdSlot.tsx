import AdUnit from "@/components/AdUnit";

type PublicAdPageType =
  | "article"
  | "guide"
  | "listing"
  | "tool"
  | "converter"
  | "search"
  | "filter"
  | "tag"
  | "private"
  | "error";

interface AdSlotProps {
  slotId?: string;
  pageType: PublicAdPageType;
  /** Count only original publisher-written words, excluding navigation and UI labels. */
  contentWords?: number;
  placement?: "after-introduction" | "between-sections" | "after-article";
  minHeight?: number;
  className?: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
const ADS_ENABLED =
  process.env.ADSENSE_ENABLED === "true" &&
  process.env.ADSENSE_CMP_READY === "true" &&
  /^ca-pub-\d{16}$/.test(CLIENT_ID ?? "");

const ELIGIBLE_PAGE_TYPES = new Set<PublicAdPageType>(["article", "guide"]);

/**
 * Server-side guard for AdSense inventory.
 * Search/filter/tag, utility, private, error and low-content pages are excluded.
 * No ad slots are inserted automatically; a page must opt in at a safe content position.
 */
export default function AdSlot({
  slotId,
  pageType,
  contentWords = 0,
  placement = "after-introduction",
  minHeight = 280,
  className,
}: AdSlotProps) {
  const eligible =
    ELIGIBLE_PAGE_TYPES.has(pageType) &&
    contentWords >= 500 &&
    Boolean(slotId?.trim());

  if (!ADS_ENABLED || !eligible) return null;

  return (
    <AdUnit
      clientId={CLIENT_ID}
      slotId={slotId}
      enabled
      eligible
      minHeight={minHeight}
      className={className}
      label="বিজ্ঞাপন"
      data-placement={placement}
    />
  );
}
