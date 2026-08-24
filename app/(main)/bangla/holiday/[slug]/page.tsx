import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Home, Eye, ArrowLeft, ChevronDown, Share2 } from "lucide-react";
import InteractiveActions from "./InteractiveActions";
import CreatorsTooltip from "./CreatorsTooltip";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getHolidayData(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/holidays/${slug}`, {
      next: { revalidate: 3600 }, // ১ ঘণ্টা ক্যাশ
    });

    if (!res.ok) return null;

    const json = await res.json();

    if (!json.success || !json.holiday) return null;

    return {
      holiday: json.holiday,
      creators: json.creators || [],
      seo: json.seo || {},
    };
  } catch (error) {
    console.error("Error fetching holiday:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getHolidayData(slug);

  if (!data) return { title: "ছুটি পাওয়া যায়নি" };

  const { holiday, seo } = data;

  return {
    title: seo.title || `${holiday.title} | ছুটির ক্যালেন্ডার`,
    description: seo.description || holiday.title,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title || holiday.title,
      description: seo.description,
      images: holiday.image_url ? [{ url: holiday.image_url }] : [],
    },
  };
}

export default async function HolidayShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getHolidayData(slug);

  if (!data) {
    notFound();
  }

  const { holiday, creators } = data;

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-zinc-400"
      >
        <Link
          href="/"
          className="hover:text-zinc-50 hover:text-zinc-50 "
        >
          <Home className="w-4 h-4" />
        </Link>
        <span>/</span>
        <Link
          href="/bangla/holiday"
          className="hover:text-zinc-50 hover:text-zinc-50 "
        >
          ছুটির ক্যালেন্ডার
        </Link>
        <span>/</span>
        <span className="text-zinc-50 text-zinc-100  truncate max-w-[180px] sm:max-w-xs">
          {holiday.title}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {holiday.type && (
              <span className="inline-flex items-center rounded-md bg-zinc-400/10 px-2.5 py-1 text-xs  ">
                {holiday.type}
              </span>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 text-zinc-100">
              {holiday.title}
            </h1>

            <p className="text-sm ">
              ছুটির ক্যালেন্ডার · বিস্তারিত তথ্য
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 rounded-md bg-zinc-400/10/50 px-2.5 py-1 text-xs  ">
                <Eye className="w-3.5 h-3.5" />
                {holiday.views_count_bn || holiday.views_count || 0} বার দেখা
                হয়েছে
              </div>
            </div>
          </div>

          {/* Creators Tooltip */}
          {creators && creators.length > 0 && (
            <div className="shrink-0">
              <CreatorsTooltip creators={creators} />
            </div>
          )}
        </div>
      </header>

      {/* Date Card */}
      <div className="flex gap-4 p-4 rounded-2xl border border-zinc-400/25 bg-zinc-800/80 ">
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-amber-50 dark:bg-amber-900/20 shrink-0">
          <span className="text-xs uppercase font-black text-amber-600 dark:text-amber-500">
            {holiday.month_short}
          </span>
          <span className="text-2xl font-bold leading-none text-zinc-50 text-zinc-100">
            {holiday.day_numeric}
          </span>
        </div>

        <div className="space-y-0.5">
          <p className="text-sm  ">
            তারিখ ও বার
          </p>
          <p className="text-lg  text-zinc-50 text-zinc-100">
            {holiday.date_formatted}
          </p>
          <p className="text-sm ">
            {holiday.day_name_bn}
          </p>
        </div>
      </div>

      {/* Large Image */}
      {holiday.image_url && (
        <div className="relative w-full h-[280px] sm:h-[400px] rounded-2xl overflow-hidden bg-zinc-400/10">
          <Image
            src={holiday.image_url}
            alt={holiday.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}

      {/* Details */}
      <section aria-labelledby="holiday-details-heading" className="space-y-4">
        <h2
          id="holiday-details-heading"
          className="text-lg font-bold text-zinc-50 text-zinc-200"
        >
          বিস্তারিত বিবরণ
        </h2>

        {holiday.details ? (
          <div
            className="text-base  prose dark:prose-invert max-w-none prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: holiday.details }}
          />
        ) : (
          <p className="text-sm text-zinc-400">
            এই ছুটির দিন সম্পর্কে অতিরিক্ত কোনো তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* Like / Dislike / Share */}
      <InteractiveActions
        holidayId={holiday.id}
        initialData={{
          reactions: holiday.reactions || {
            like_count: 0,
            dislike_count: 0,
            user_has_liked: false,
            user_has_disliked: false,
          },
          title: holiday.title,
          slug: holiday.slug,
        }}
      />

      {/* Back Button */}
      <div>
        <Link
          href="/bangla/holiday"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm  text-zinc-300 hover:bg-zinc-900 text-zinc-300 hover:bg-zinc-800 rounded-lg "
        >
          <ArrowLeft className="w-4 h-4" />
          ছুটির ক্যালেন্ডারে ফিরে যান
        </Link>
      </div>

      {/* About Section */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-4">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          {holiday.title} সম্পর্কে
        </h2>
        <div className="text-sm leading-relaxed  space-y-4">
          <p>
            <strong>{holiday.title}</strong> হলো বাংলাদেশের {holiday.type || ""}{" "}
            ছুটি। তারিখ: <strong>{holiday.date_formatted}</strong> (
            {holiday.day_name_bn})।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </h2>

        <div className="space-y-2">
          <details className="group rounded-xl border border-zinc-400/25 bg-zinc-800/80 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5  text-zinc-50 text-zinc-200 hover:bg-zinc-900 hover:bg-zinc-800/50 transition list-none">
              <span>{holiday.title} কী?</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm  leading-relaxed border-t border-zinc-400/25 pt-3">
              উপরের “বিস্তারিত বিবরণ” সেকশনে এই ছুটির পূর্ণাঙ্গ ব্যাখ্যা লেখা
              আছে।
            </div>
          </details>

          <details className="group rounded-xl border border-zinc-400/25 bg-zinc-800/80 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5  text-zinc-50 text-zinc-200 hover:bg-zinc-900 hover:bg-zinc-800/50 transition list-none">
              <span>অন্যান্য ছুটি কোথায় পাব?</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm  leading-relaxed border-t border-zinc-400/25 pt-3">
              <Link
                href="/bangla/holiday"
                className="text-amber-600 hover:underline "
              >
                ছুটির ক্যালেন্ডার
              </Link>{" "}
              তালিকায় ফিরে গিয়ে অন্যান্য ছুটি দেখতে পারবেন।
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
