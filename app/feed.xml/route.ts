import { NextResponse } from "next/server";
import { ALL_NAV_ITEMS } from "@/config/navigation";

export const revalidate = 86400;

export async function GET() {
  const indexableItems = ALL_NAV_ITEMS.filter((item) => item.indexable);
  const now = new Date().toUTCString();

  const rssItems = indexableItems
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.label}]]></title>
      <link>https://totthobox.com${item.href}</link>
      <guid isPermaLink="true">https://totthobox.com${item.href}</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${now}</pubDate>
    </item>`,
    )
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Totthobox (তথ্যবক্স) — ডিজিটাল তথ্য ও নাগরিক সেবা</title>
    <link>https://totthobox.com</link>
    <description>বাংলাদেশের প্রয়োজনীয় ডিজিটাল টুলস, ক্যালকুলেটর, কনভার্টার ও জাতীয় তথ্যকোষ</description>
    <language>bn-BD</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://totthobox.com/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
