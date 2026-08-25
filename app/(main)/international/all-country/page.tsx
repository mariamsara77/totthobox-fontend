import type { Metadata } from "next";
import { CountryGrid } from "@/components/international/CountryGrid";

type SearchParams = {
  search?: string;
  regionFilter?: string;
  sortBy?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const search = (params.search || "").trim();
  const regionFilter = (params.regionFilter || "").trim();
  const site = "Totthobox";

  if (search) {
    return {
      title: `"${search.slice(0, 40)}" — দেশের তথ্য | ${site}`,
      description: `"${search}" সম্পর্কিত দেশের রাজধানী, জনসংখ্যা, আয়তন — ${site}।`,
      keywords: `${search}, দেশের তালিকা, রাজধানী, জনসংখ্যা, ${site}`,
      robots: { index: false, follow: true },
      alternates: { canonical: "/international/all-country" },
      openGraph: {
        title: `"${search.slice(0, 40)}" — দেশের তথ্য | ${site}`,
        description: `"${search}" সম্পর্কিত দেশের রাজধানী, জনসংখ্যা, আয়তন — ${site}।`,
        images: ["/og-image.png"],
      },
    };
  }

  if (regionFilter) {
    return {
      title: `${regionFilter} অঞ্চলের দেশসমূহ — রাজধানী ও তথ্য | ${site}`,
      description: `${regionFilter} অঞ্চলের দেশের রাজধানী, জনসংখ্যা ও আন্তর্জাতিক কোড — ${site}।`,
      keywords: `${regionFilter}, দেশের তালিকা, ${regionFilter} দেশ, ${site}`,
      robots: { index: false, follow: true },
      alternates: { canonical: "/international/all-country" },
      openGraph: {
        title: `${regionFilter} অঞ্চলের দেশসমূহ — রাজধানী ও তথ্য | ${site}`,
        description: `${regionFilter} অঞ্চলের দেশের রাজধানী, জনসংখ্যা ও আন্তর্জাতিক কোড — ${site}।`,
        images: ["/og-image.png"],
      },
    };
  }

  return {
    title: `বিশ্বকোষ: পৃথিবীর সব দেশের তালিকা, রাজধানী ও সাধারণ জ্ঞান | ${site}`,
    description:
      "পৃথিবীর ২৫০+ দেশের রাজধানী, জনসংখ্যা, আয়তন, ভাষা ও আন্তর্জাতিক কোডসহ সম্পূর্ণ তথ্যভাণ্ডার — Totthobox।",
    keywords:
      "দেশের তালিকা, সব দেশের রাজধানী, পৃথিবীর দেশসমূহ, দেশের জনসংখ্যা, সাধারণ জ্ঞান, বিশ্বকোষ, Totthobox",
    openGraph: {
      title: `বিশ্বকোষ: পৃথিবীর সব দেশের তালিকা, রাজধানী ও সাধারণ জ্ঞান | ${site}`,
      description:
        "পৃথিবীর ২৫০+ দেশের রাজধানী, জনসংখ্যা, আয়তন, ভাষা ও আন্তর্জাতিক কোডসহ সম্পূর্ণ তথ্যভাণ্ডার — Totthobox।",
      images: ["/og-image.png"],
    },
    alternates: { canonical: "/international/all-country" },
  };
}

export default async function InternationalAllCountryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = (params.search || "").trim();
  const regionFilter = (params.regionFilter || "").trim();

  let h1 = "বিশ্বকোষ: পৃথিবীর সকল দেশের বিস্তারিত তথ্য";
  let sub =
    "পৃথিবীতে রয়েছে অসংখ্য বৈচিত্র্যময় দেশ। ২৫০টিরও বেশি দেশের রাজধানী, জনসংখ্যা, আয়তন ও কোড এক জায়গায়।";

  if (search) {
    h1 = `"${search}" খোঁজার ফলাফল`;
    sub = "মিল থাকা দেশসমূহের তথ্য";
  } else if (regionFilter) {
    h1 = `${regionFilter} অঞ্চলের দেশসমূহ`;
    sub = "এই অঞ্চলের দেশের বিস্তারিত তথ্য";
  }

  return (
    <section className="max-w-2xl mx-auto space-y-4 p-4">
      <article className="prose dark:prose-invert max-w-none text-center pb-6 border-b border-zinc-400/25">
        <h1 className="text-3xl font-bold mb-4 text-zinc-50 text-zinc-100">
          {h1}
        </h1>
        <p className=" text-lg leading-relaxed  max-w-2xl mx-auto">{sub}</p>
      </article>

      <CountryGrid
        initialSearch={search}
        initialRegion={regionFilter}
        initialSort={params.sortBy || "name"}
      />
    </section>
  );
}
