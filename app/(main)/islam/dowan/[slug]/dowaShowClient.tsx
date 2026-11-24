"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Play, Pause, Star, ChevronDown } from "lucide-react";
import InteractiveActions from "./InteractiveActions";
import MediaGallery from "@/components/MediaGallery";

interface Props {
  initialData: {
    item: any;
    views: number;
    shareable_text: string;
  };
  slug: string;
}

function getExcerpt(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const candidate = value.slice(0, maxLength);
  const lastSpace = candidate.lastIndexOf(" ");
  const excerpt = lastSpace > Math.floor(maxLength * 0.7) ? candidate.slice(0, lastSpace) : candidate;
  return `${excerpt.trimEnd()}...`;
}
export default function DowaShowClient({ initialData, slug }: Props) {
  const { item, views, shareable_text } = initialData;
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (item.audio_url) {
      audioRef.current = new Audio(item.audio_url);
      audioRef.current.onended = () => setPlaying(false);
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [item.audio_url]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const plainMeaning = (item.bangla_meaning || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const plainFojilot = (item.bangla_fojilot || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const contentExcerpt = (plainMeaning || plainFojilot || item.bangla_text || "")
    .replace(/\s+/g, " ")
    .trim();
  const descriptionExcerpt =
    contentExcerpt.length > 320
      ? getExcerpt(contentExcerpt, 320)
      : contentExcerpt;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "হোম", item: "https://totthobox.com/" },
      { "@type": "ListItem", position: 2, name: "দোয়া সংগ্রহ", item: "https://totthobox.com/islam/dowan" },
      { "@type": "ListItem", position: 3, name: item.bangla_name, item: `https://totthobox.com/islam/dowan/${encodeURIComponent(slug)}` },
    ],
  };

  // MediaGallery support
  const media =
    item.media && item.media.length > 0
      ? item.media.map((m: any) => ({
          url: m.url,
          caption: m.caption || item.bangla_name,
        }))
      : item.first_media_url
        ? [{ url: item.first_media_url, caption: item.bangla_name }]
        : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="hover:underline">
          হোম
        </Link>
        <span>/</span>
        <Link href="/islam/dowan" className="hover:underline">
          দোয়া সংগ্রহ
        </Link>
        <span>/</span>
        <span className="truncate opacity-70">{item.bangla_name}</span>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {item.is_featured && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-zinc-400/15">
            <Star className="w-3.5 h-3.5" /> বিশেষ আমল
          </span>
        )}
        {item.type && (
          <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-400/10">
            {item.type_name || item.type}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-zinc-400/10">
          <Eye className="w-3.5 h-3.5" />
          {(views || 0).toLocaleString("bn-BD")}
        </span>
      </div>

      {/* Title */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {item.bangla_name}
        </h1>
        {item.arabic_name && (
          <p className="text-xl font-serif opacity-90" dir="rtl">
            {item.arabic_name}
          </p>
        )}
        <p className="text-sm opacity-70">আরবি · উচ্চারণ · অর্থ ও ফজিলত</p>
      </header>

      {/* Media Gallery */}
      {media.length > 0 && (
        <div className="rounded-2xl overflow-hidden">
          <MediaGallery media={media} />
        </div>
      )}

      {/* Audio Player */}
      {item.audio_url && (
        <div className="rounded-2xl p-4 flex items-center gap-4 bg-zinc-400/10">
          <button
            onClick={toggleAudio}
            className="p-3 rounded-full bg-zinc-400/20 hover:bg-zinc-400/30 transition"
            aria-label={playing ? "অডিও পজ করুন" : "অডিও প্লে করুন"}
          >
            {playing ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <div>
            <p className="text-sm font-semibold">দোয়াটির অডিও</p>
            <p className="text-xs opacity-70 mt-0.5">
              {playing ? "প্লে হচ্ছে..." : "শুনতে বাটনে ক্লিক করুন"}
            </p>
          </div>
        </div>
      )}

      {/* Arabic Text */}
      {item.arabic_text && (
        <div
          dir="rtl"
          className="rounded-2xl bg-zinc-400/10 py-6 px-4 text-center text-2xl font-serif leading-relaxed"
        >
          {item.arabic_text}
        </div>
      )}

      {/* Details */}
      <section className="space-y-5">
        <h2 className="text-lg font-bold">বিস্তারিত বিবরণ</h2>

        {item.bangla_text && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold opacity-80">উচ্চারণ</h3>
            <div className="rounded-2xl bg-zinc-400/10 py-5 px-4 text-center text-lg leading-relaxed">
              {item.bangla_text}
            </div>
          </div>
        )}

        {item.bangla_meaning && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold opacity-80">অনুবাদ ও অর্থ</h3>
            <div
              className="rounded-2xl bg-zinc-400/10 py-5 px-4 prose dark:prose-invert max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.bangla_meaning }}
            />
          </div>
        )}

        {item.bangla_fojilot && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold opacity-80">ফজিলত ও আমল</h3>
            <div
              className="rounded-2xl bg-zinc-400/10 py-5 px-4 prose dark:prose-invert max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.bangla_fojilot }}
            />
          </div>
        )}

        {!item.bangla_text && !item.bangla_meaning && !item.bangla_fojilot && (
          <p className="text-sm opacity-60">
            এই দোয়ার বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Interactive Actions */}
      <InteractiveActions
        itemId={item.id}
        initialLike={item.like_count ?? 0}
        initialDislike={item.dislike_count ?? 0}
        hasLike={item.has_like ?? false}
        hasDislike={item.has_dislike ?? false}
        shareableText={shareable_text}
        shareTitle={item.bangla_name}
      />

      {/* Back */}
      <Link
        href="/islam/dowan"
        className="inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        দোয়া সংগ্রহ তালিকায় ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10 p-5 space-y-3">
        <h2 className="text-lg font-bold">{item.bangla_name} সম্পর্কে</h2>
        <div className="text-sm leading-relaxed space-y-2 opacity-90">
          <p>
            <strong>{item.bangla_name}</strong>
            {item.arabic_name && (
              <>
                {" "}
                (<span className="font-serif">{item.arabic_name}</span>)
              </>
            )}{" "}
            দোয়া ও আমলের তথ্য।
          </p>
          {descriptionExcerpt && <p>{descriptionExcerpt}</p>}
          {!descriptionExcerpt && (
            <p>এই দোয়ার বিস্তারিত অর্থ ও ফজিলতের তথ্য এখনো যোগ করা হয়নি।</p>
          )}
          <p>
            আরও দোয়া দেখতে{" "}
            <Link href="/islam/dowan" className="underline">
              দোয়া সংগ্রহ
            </Link>{" "}
            তালিকায় যান।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              {item.bangla_name} কখন পড়বেন?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            উপরের “ফজিলত ও আমল” সেকশনে এই দোয়ার উপযুক্ত সময় ও নিয়ম লেখা আছে।
            নিয়মিত পাঠ করলে বেশি উপকার পাওয়া যায়।
          </div>
        </details>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              অন্যান্য দোয়া কোথায় পাব?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            <Link href="/islam/dowan" className="underline">
              দোয়া সংগ্রহ
            </Link>{" "}
            তালিকায় ফিরে গিয়ে আরও অনেক প্রয়োজনীয় দোয়া ও আমল দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
