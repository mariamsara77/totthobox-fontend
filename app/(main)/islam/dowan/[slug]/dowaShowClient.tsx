"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import InteractiveActions from "./InteractiveActions";
import { ArrowLeft, Eye, Play, Pause, Star } from "lucide-react";

interface Props {
  initialData: {
    item: any;
    views: number;
    shareable_text: string;
  };
  slug: string;
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

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 py-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-zinc-400 flex flex-wrap items-center gap-1"
      >
        <Link href="/" className="hover:text-zinc-300">
          হোম
        </Link>
        <span>/</span>
        <Link href="/islam/dowan" className="hover:text-zinc-300">
          দোয়া সংগ্রহ
        </Link>
        <span>/</span>
        <span className="text-zinc-50 text-zinc-200 truncate max-w-[180px]">
          {item.bangla_name}
        </span>
      </nav>

      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2">
        {item.is_featured && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-zinc-400/25 opacity-50 dark:bg-zinc-400/25 dark:opacity-50">
            <Star className="w-3.5 h-3.5" /> বিশেষ আমল
          </span>
        )}
        {item.type && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-400/10 text-zinc-300">
            {item.type}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-zinc-400/10">
          <Eye className="w-3.5 h-3.5" /> {views}
        </span>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl  font-black tracking-tight text-zinc-50 dark:text-white">
          {item.bangla_name}
        </h1>
        {item.arabic_name && (
          <p className="text-xl font-serif  ">
            {item.arabic_name}
          </p>
        )}
        <p className="text-sm text-zinc-400">আরবি · উচ্চারণ · অর্থ ও ফজিলত</p>
      </div>

      {/* Audio Player */}
      {item.audio_url && (
        <div className="rounded-2xl p-4 flex items-center gap-4 border border-zinc-400/25 bg-zinc-400/10/40">
          <button
            onClick={toggleAudio}
            className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
            aria-label={playing ? "অডিও পজ করুন" : "অডিও প্লে করুন"}
          >
            {playing ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <div>
            <p className="text-sm font-bold text-zinc-50 text-zinc-200">
              দোয়াটির অডিও লিসেনিং
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {playing ? "বর্তমানে প্লে হচ্ছে..." : "শুনতে বাটনে ক্লিক করুন"}
            </p>
          </div>
        </div>
      )}

      {/* Arabic Text */}
      {item.arabic_text && (
        <div
          dir="rtl"
          className="rounded-2xl border border-zinc-400/25 border-l-4 border-l-emerald-500 py-6 px-4 text-center text-2xl  font-serif leading-relaxed"
        >
          {item.arabic_text}
        </div>
      )}

      {/* Details */}
      <section aria-labelledby="dowa-details-heading" className="space-y-4">
        <h2
          id="dowa-details-heading"
          className="text-lg font-bold text-zinc-50 text-zinc-200"
        >
          বিস্তারিত বিবরণ
        </h2>

        {item.bangla_text && (
          <div>
            <h3 className="text-sm font-bold text-sky-600 dark:text-sky-400 mb-2 tracking-wide">
              উচ্চারণ
            </h3>
            <div
              dir="rtl"
              className="rounded-2xl border border-zinc-400/25 border-l-4 border-l-blue-500 py-6 px-4 text-center text-xl sm:text-2xl leading-relaxed"
            >
              {item.bangla_text}
            </div>
          </div>
        )}

        {item.bangla_meaning && (
          <div>
            <h3 className="text-sm font-bold  mb-2 tracking-wide">
              অনুবাদ ও অর্থ
            </h3>
            <div
              className="rounded-2xl border border-zinc-400/25 border-l-4 border-l-orange-500 py-6 px-4 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.bangla_meaning }}
            />
          </div>
        )}

        {item.bangla_fojilot && (
          <div className="rounded-2xl bg-zinc-400/25 dark:bg-zinc-400/25 border border-zinc-400/25 dark:border-zinc-400/25 p-4">
            <h3 className="text-sm font-bold opacity-50 dark:opacity-50 mb-4 tracking-wide flex items-center gap-2">
              <span className="opacity-50">ℹ</span> ফজিলত ও আমল
            </h3>
            <div
              className="prose prose-sm dark:prose-invert max-w-none  leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.bangla_fojilot }}
            />
          </div>
        )}

        {!item.bangla_text && !item.bangla_meaning && !item.bangla_fojilot && (
          <p className="text-sm text-zinc-400">
            এই দোয়ার বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      <div>
        <Link
          href="/islam/dowan"
          className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-300"
        >
          <ArrowLeft className="w-4 h-4" /> দোয়া সংগ্রহ তালিকায় ফিরে যান
        </Link>
      </div>

      {/* Like / Dislike / Copy / Share */}
      <InteractiveActions
        itemId={item.id}
        initialLike={item.like_count ?? 0}
        initialDislike={item.dislike_count ?? 0}
        hasLike={item.has_like ?? false}
        hasDislike={item.has_dislike ?? false}
        shareableText={shareable_text}
        shareTitle={item.bangla_name}
      />

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-4">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          {item.bangla_name} সম্পর্কে
        </h2>
        <p className="text-sm leading-relaxed ">
          <strong>{item.bangla_name}</strong>
          {item.arabic_name && (
            <>
              {" "}
              (<span className="font-serif">{item.arabic_name}</span>)
            </>
          )}{" "}
          একটি গুরুত্বপূর্ণ ইসলামিক দোয়া/আমল। উপরের আরবি পাঠ, উচ্চারণ, অর্থ ও
          ফজিলত অনুসরণ করে নিয়মিত পাঠ করুন।
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
        <div className="space-y-2">
          <details className="group rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-2  list-none hover:bg-zinc-400/10 hover:bg-zinc-400/10">
              <span>{item.bangla_name} কখন পড়বেন?</span>
              <span className="text-zinc-400 group-open:rotate-180 transition">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm ">
              উপরের “ফজিলত ও আমল” সেকশনে এই দোয়ার উপযুক্ত সময় ও নিয়ম লেখা আছে।
              নিয়মিত পাঠ করলে বেশি উপকার পাওয়া যায়।
            </div>
          </details>
          <details className="group rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-2  list-none hover:bg-zinc-400/10 hover:bg-zinc-400/10">
              <span>অন্যান্য দোয়া কোথায় পাব?</span>
              <span className="text-zinc-400 group-open:rotate-180 transition">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm ">
              <Link
                href="/islam/dowan"
                className="text-zinc-300 hover:underline"
              >
                দোয়া সংগ্রহ
              </Link>{" "}
              তালিকায় ফিরে গিয়ে আরও অনেক প্রয়োজনীয় দোয়া ও আমল দেখতে পারবেন।
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
