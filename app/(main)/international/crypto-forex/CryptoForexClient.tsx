"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import useSWR from "swr";
import {
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Coins,
  Search,
  Star,
  AlertTriangle,
  X,
  Info,
} from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import {
  ShareToolButton,
  CopyResultButton,
} from "@/components/tools/ToolActions";

/* ------------------------------------------------------------------ */
/* Types, constants, helpers                                           */
/* ------------------------------------------------------------------ */

interface CryptoInfo {
  name: string;
  priceUsd: number;
  change24h: number;
  symbol?: string;
}
interface ApiData {
  crypto?: Record<string, CryptoInfo>;
  forex?: Record<string, number>;
}
interface CryptoRow extends CryptoInfo {
  key: string;
}

const fetcher = async (url: string): Promise<ApiData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
};

const REFRESH_MS = 60000;
const STORAGE_KEY = "totthobox:crypto-forex:v2";
const FALLBACK_BDT = 122.5;

const FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  BDT: "🇧🇩",
  INR: "🇮🇳",
  SAR: "🇸🇦",
  AED: "🇦🇪",
  JPY: "🇯🇵",
  CNY: "🇨🇳",
  MYR: "🇲🇾",
  SGD: "🇸🇬",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  KWD: "🇰🇼",
  QAR: "🇶🇦",
  PKR: "🇵🇰",
  CHF: "🇨🇭",
  TRY: "🇹🇷",
  KRW: "🇰🇷",
  RUB: "🇷🇺",
  THB: "🇹🇭",
};
const flagOf = (code: string) => FLAGS[code] ?? "💱";

const QUICK_AMOUNTS = ["1", "10", "100", "1000"];
const QUICK_PAIRS: [string, string][] = [
  ["BTC", "BDT"],
  ["ETH", "USD"],
  ["USD", "BDT"],
  ["EUR", "BDT"],
  ["SAR", "BDT"],
  ["GBP", "BDT"],
];
const ALSO_TARGETS = ["BDT", "USD", "EUR", "GBP", "SAR"];

/** Readable number: big → 2 decimals, medium → up to 4, tiny → significant digits. */
function fmt(n: number, opts?: { max?: number }): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1000)
    return n.toLocaleString("en-US", { maximumFractionDigits: opts?.max ?? 2 });
  if (abs >= 1)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: opts?.max ?? 4,
    });
  if (abs === 0) return "0";
  return n.toLocaleString("en-US", { maximumSignificantDigits: 4 });
}

function formatAgo(seconds: number): string {
  if (seconds < 5) return "এইমাত্র";
  if (seconds < 60) return `${seconds} সেকেন্ড আগে`;
  const m = Math.floor(seconds / 60);
  return `${m} মিনিট আগে`;
}

const fieldCls =
  "w-full min-h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 text-zinc-900 dark:text-zinc-100";
const labelCls = "text-xs font-semibold text-zinc-500 dark:text-zinc-400";
const cardCls =
  "rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs";
const chipCls =
  "min-h-9 px-3 rounded-full border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40";

type MarketTab = "crypto" | "forex";
type SortKey = "price" | "gainers" | "losers" | "name";
type Currency = "USD" | "BDT";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface AssetSelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  hasData: boolean;
  cryptoList: CryptoRow[];
  forexCodes: string[];
  className: string;
}

function AssetSelect({
  id,
  value,
  onChange,
  hasData,
  cryptoList,
  forexCodes,
  className,
}: AssetSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      disabled={!hasData}
    >
      {!hasData && <option>{value}</option>}
      {cryptoList.length > 0 && (
        <optgroup label="ক্রিপ্টোকারেন্সি">
          {cryptoList.map((c) => (
            <option key={`${id}-${c.key}`} value={c.key}>
              {c.key} · {c.name}
            </option>
          ))}
        </optgroup>
      )}
      {forexCodes.length > 0 && (
        <optgroup label="ফিয়াট মুদ্রা">
          {forexCodes.map((f) => (
            <option key={`${id}-${f}`} value={f}>
              {flagOf(f)} {f}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}

export default function CryptoForexClient() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiData>(
    "/api/crypto-forex",
    fetcher,
    {
      refreshInterval: REFRESH_MS,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  // Converter
  const [amount, setAmount] = useState("1");
  const [fromAsset, setFromAsset] = useState("BTC");
  const [toAsset, setToAsset] = useState("BDT");

  // Market
  const [marketTab, setMarketTab] = useState<MarketTab>("crypto");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [displayCcy, setDisplayCcy] = useState<Currency>("BDT");
  const [starred, setStarred] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Freshness
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(0);

  /* ---- persistence ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.starred)) setStarred(s.starred);
        if (s.displayCcy === "USD" || s.displayCcy === "BDT")
          setDisplayCcy(s.displayCcy);
        if (typeof s.fromAsset === "string") setFromAsset(s.fromAsset);
        if (typeof s.toAsset === "string") setToAsset(s.toAsset);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ starred, displayCcy, fromAsset, toAsset }),
      );
    } catch {
      /* ignore */
    }
  }, [starred, displayCcy, fromAsset, toAsset, hydrated]);

  /* ---- freshness tracking ---- */
  useEffect(() => {
    if (data) {
      const now = Date.now();
      setUpdatedAt(now);
      setNowMs(now);
    }
  }, [data]);

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const secondsAgo =
    updatedAt && nowMs >= updatedAt
      ? Math.max(0, Math.floor((nowMs - updatedAt) / 1000))
      : null;

  /* ---- derived data ---- */
  const cryptoList: CryptoRow[] = useMemo(() => {
    if (!data?.crypto) return [];
    return Object.entries(data.crypto).map(([key, info]) => ({ key, ...info }));
  }, [data?.crypto]);

  const forexCodes = useMemo(
    () => Object.keys(data?.forex ?? {}),
    [data?.forex],
  );
  const bdtRate = data?.forex?.BDT || FALLBACK_BDT;

  const usdPrice = useCallback(
    (key: string): number => {
      if (data?.crypto?.[key]) return data.crypto[key].priceUsd;
      if (key === "USD") return 1;
      const rate = data?.forex?.[key];
      if (rate && rate > 0) return 1 / rate; // 1 fiat = 1/rate USD
      return 0;
    },
    [data],
  );

  const isKnown = useCallback(
    (key: string) =>
      key === "USD" || !!data?.crypto?.[key] || !!data?.forex?.[key],
    [data],
  );

  const conversion = useMemo(() => {
    const num = parseFloat(amount);
    if (!data || !Number.isFinite(num) || num <= 0) return null;
    const from = usdPrice(fromAsset);
    const to = usdPrice(toAsset);
    if (from <= 0 || to <= 0) return null;
    const rate = from / to;
    const result = num * rate;
    return {
      result,
      rate,
      inverse: 1 / rate,
      formatted: fmt(result, { max: result < 0.01 ? 8 : 4 }),
      also: ALSO_TARGETS.filter(
        (c) => c !== fromAsset && c !== toAsset && isKnown(c),
      )
        .slice(0, 4)
        .map((c) => ({ code: c, value: (num * from) / usdPrice(c) })),
    };
  }, [amount, fromAsset, toAsset, data, usdPrice, isKnown]);

  /* ---- market lists ---- */
  const q = search.trim().toLowerCase();

  const filteredCrypto = useMemo(() => {
    let list = cryptoList.filter(
      (c) =>
        !q ||
        c.key.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q),
    );
    if (onlyStarred) list = list.filter((c) => starred.includes(c.key));
    const sorted = [...list];
    switch (sortKey) {
      case "gainers":
        sorted.sort((a, b) => b.change24h - a.change24h);
        break;
      case "losers":
        sorted.sort((a, b) => a.change24h - b.change24h);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => b.priceUsd - a.priceUsd);
    }
    // starred first within same sort (stable pin)
    return sorted.sort(
      (a, b) =>
        Number(starred.includes(b.key)) - Number(starred.includes(a.key)),
    );
  }, [cryptoList, q, onlyStarred, starred, sortKey]);

  const filteredForex = useMemo(() => {
    let list = forexCodes.filter((c) => !q || c.toLowerCase().includes(q));
    if (onlyStarred) list = list.filter((c) => starred.includes(c));
    return list.sort(
      (a, b) =>
        Number(starred.includes(b)) - Number(starred.includes(a)) ||
        a.localeCompare(b),
    );
  }, [forexCodes, q, onlyStarred, starred]);

  const topGainer = useMemo(
    () =>
      cryptoList.length
        ? [...cryptoList].sort((a, b) => b.change24h - a.change24h)[0]
        : null,
    [cryptoList],
  );
  const topLoser = useMemo(
    () =>
      cryptoList.length
        ? [...cryptoList].sort((a, b) => a.change24h - b.change24h)[0]
        : null,
    [cryptoList],
  );

  /* ---- actions ---- */
  const swapAssets = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
  };
  const toggleStar = (key: string) =>
    setStarred((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  const pickPair = (from: string, to: string) => {
    setFromAsset(from);
    setToAsset(to);
  };
  const useInConverter = (key: string) => {
    setFromAsset(key);
    setToAsset(key === "BDT" ? "USD" : "BDT");
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasData = !!data && (cryptoList.length > 0 || forexCodes.length > 0);
  const showSkeleton = isLoading && !hasData;
  const showError = !!error && !hasData;

  const priceLabel = (usd: number) =>
    displayCcy === "USD"
      ? `$${fmt(usd, { max: 2 })}`
      : `৳${fmt(usd * bdtRate, { max: 2 })}`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 space-y-6 sm:space-y-8">
      {/* ---------- Header ---------- */}
      <header className="space-y-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Coins className="w-3.5 h-3.5" />
            লাইভ ফরেক্স ও ক্রিপ্টো রূপান্তর
          </span>
          <FavoriteButton
            tool={{
              id: "crypto-forex",
              title: "লাইভ ক্রিপ্টো ও ফরেক্স রেট",
              path: "/international/crypto-forex",
              category: "গ্লোবাল তথ্য",
            }}
          />
          <ShareToolButton title="লাইভ ক্রিপ্টো ও ফরেক্স রেট কনভার্টার - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          লাইভ ক্রিপ্টো ও ফরেক্স এক্সচেঞ্জ রেট
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          বিটকয়েন, ইথেরিয়াম সহ শীর্ষ ক্রিপ্টো এবং বিডিটি, ইউএসডি, ইউরো,
          রিয়ালের মতো মুদ্রার লাইভ রেট ও রূপান্তর।
        </p>
      </header>

      {/* ---------- Status bar ---------- */}
      <div
        className={`${cardCls} px-4 py-2.5 flex items-center justify-between gap-3`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 min-w-0">
          <span className="relative flex w-2.5 h-2.5 shrink-0">
            <span
              className={`absolute inset-0 rounded-full ${
                showError
                  ? "bg-rose-500"
                  : isValidating
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-500"
              }`}
            />
          </span>
          <span className="truncate">
            {showError
              ? "ডেটা লোড হয়নি"
              : isValidating
                ? "আপডেট হচ্ছে…"
                : secondsAgo !== null
                  ? `আপডেট: ${formatAgo(secondsAgo)}`
                  : "লোড হচ্ছে…"}
          </span>
          {error && hasData && (
            <span className="text-rose-600 dark:text-rose-400 shrink-0">
              · পুরোনো ডেটা
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => mutate()}
          aria-label="রেট রিফ্রেশ করুন"
          className="shrink-0 min-h-9 inline-flex items-center gap-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isValidating ? "animate-spin" : ""}`}
          />
          রিফ্রেশ
        </button>
      </div>

      {/* ---------- Error ---------- */}
      {showError && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-center space-y-3">
          <AlertTriangle className="w-6 h-6 mx-auto text-rose-600 dark:text-rose-400" />
          <p className="text-sm text-zinc-800 dark:text-zinc-200">
            রেট আনা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।
          </p>
          <button
            onClick={() => mutate()}
            className="min-h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* ---------- Converter ---------- */}
      {!showError && (
        <section
          aria-label="লাইভ কনভার্টার"
          className={`${cardCls} p-4 sm:p-5 space-y-4`}
        >
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            কনভার্টার
          </h2>

          {/* Amount */}
          <div className="space-y-1.5">
            <label htmlFor="cf-amount" className={labelCls}>
              পরিমাণ
            </label>
            <input
              id="cf-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`${fieldCls} text-lg`}
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(a)}
                  className={`${chipCls} ${
                    amount === a
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {Number(a).toLocaleString("en-US")}
                </button>
              ))}
            </div>
          </div>

          {/* From / swap / To */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div className="space-y-1.5">
              <label htmlFor="cf-from" className={labelCls}>
                থেকে (From)
              </label>
              <AssetSelect
                id="cf-from"
                value={fromAsset}
                onChange={setFromAsset}
                hasData={hasData}
                cryptoList={cryptoList}
                forexCodes={forexCodes}
                className={fieldCls}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={swapAssets}
                aria-label="মুদ্রা অদলবদল করুন"
                title="অদলবদল"
                className="min-h-12 min-w-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex items-center justify-center shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                <ArrowRightLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300 rotate-90 sm:rotate-0" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cf-to" className={labelCls}>
                এতে (To)
              </label>
              <AssetSelect
                id="cf-to"
                value={toAsset}
                onChange={setToAsset}
                hasData={hasData}
                cryptoList={cryptoList}
                forexCodes={forexCodes}
                className={fieldCls}
              />
            </div>
          </div>

          {/* Popular pairs */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PAIRS.filter(([a, b]) => isKnown(a) && isKnown(b)).map(
              ([a, b]) => {
                const active = fromAsset === a && toAsset === b;
                return (
                  <button
                    key={`${a}-${b}`}
                    type="button"
                    onClick={() => pickPair(a, b)}
                    className={`${chipCls} ${
                      active
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {a} → {b}
                  </button>
                );
              },
            )}
          </div>

          {/* Result */}
          {showSkeleton ? (
            <div
              className="rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse h-40"
              aria-hidden
            />
          ) : conversion ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--accent-soft-border)] bg-[var(--surface-card)] p-5 text-center space-y-3 shadow-[var(--shadow-xs)]">
              <p className="text-xs font-semibold text-zinc-500">
                {fmt(parseFloat(amount), { max: 8 })} {fromAsset} =
              </p>
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50 break-all">
                  {conversion.formatted}
                </span>
                <span className="text-lg font-semibold text-[var(--accent-ink)]">
                  {toAsset}
                </span>
              </div>
              <div className="text-xs text-zinc-500 space-y-0.5">
                <p>
                  ১ {fromAsset} = {fmt(conversion.rate, { max: 6 })} {toAsset}
                </p>
                <p>
                  ১ {toAsset} = {fmt(conversion.inverse, { max: 6 })}{" "}
                  {fromAsset}
                </p>
              </div>

              {conversion.also.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-emerald-500/15 text-left">
                  {conversion.also.map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => setToAsset(a.code)}
                      className="rounded-[var(--radius-lg)] bg-[var(--surface-raised)] border border-zinc-200/70 dark:border-zinc-800 px-3 py-2 hover:border-[var(--accent-soft-border)] transition-colors"
                    >
                      <span className="block text-xs text-zinc-500">
                        {flagOf(a.code)} {a.code}
                      </span>
                      <span className="block text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 truncate">
                        {fmt(a.value, { max: 2 })}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-center pt-1">
                <CopyResultButton
                  textToCopy={`${amount} ${fromAsset} = ${conversion.formatted} ${toAsset}`}
                  label="ফলাফল কপি করুন"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-center text-zinc-500 py-4">
              {hasData
                ? "০-এর বেশি একটি পরিমাণ লিখুন।"
                : "রেট লোড হলে ফলাফল এখানে দেখাবে।"}
            </p>
          )}
        </section>
      )}

      {/* ---------- Market movers ---------- */}
      {topGainer && topLoser && (
        <section
          aria-label="২৪ ঘণ্টার সেরা ও খারাপ পারফর্মার"
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: "সর্বোচ্চ বৃদ্ধি", coin: topGainer, up: true },
            { label: "সর্বোচ্চ পতন", coin: topLoser, up: false },
          ].map(({ label, coin, up }) => (
            <button
              key={label}
              type="button"
              onClick={() => useInConverter(coin.key)}
              className={`${cardCls} p-3.5 text-left hover:border-zinc-300 dark:hover:border-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40`}
            >
              <p className="text-xs text-zinc-500">{label} (২৪ ঘণ্টা)</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {coin.name}{" "}
                <span className="font-normal text-zinc-500">{coin.key}</span>
              </p>
              <p
                className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
                  up
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {up ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {coin.change24h >= 0 ? "+" : ""}
                {coin.change24h.toFixed(2)}%
              </p>
            </button>
          ))}
        </section>
      )}

      {/* ---------- Market ---------- */}
      {!showError && (
        <section aria-label="লাইভ মার্কেট রেট" className="space-y-3">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="মার্কেট বিভাগ"
            className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800/80"
          >
            {(
              [
                { id: "crypto", label: "ক্রিপ্টো" },
                { id: "forex", label: "ফরেক্স (BDT)" },
              ] as { id: MarketTab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={marketTab === t.id}
                onClick={() => setMarketTab(t.id)}
                className={`min-h-11 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                  marketTab === t.id
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search + filters */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                marketTab === "crypto"
                  ? "কয়েনের নাম বা সিম্বল খুঁজুন"
                  : "মুদ্রার কোড খুঁজুন (যেমন USD)"
              }
              aria-label="খুঁজুন"
              className={`${fieldCls} pl-10 pr-11 font-normal`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="মুছুন"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-9 min-w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {marketTab === "crypto" && (
              <>
                {(
                  [
                    { id: "price", label: "দাম" },
                    { id: "gainers", label: "বৃদ্ধি" },
                    { id: "losers", label: "পতন" },
                    { id: "name", label: "নাম" },
                  ] as { id: SortKey; label: string }[]
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sortKey === s.id}
                    onClick={() => setSortKey(s.id)}
                    className={`${chipCls} ${
                      sortKey === s.id
                        ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                <span
                  className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1"
                  aria-hidden
                />
                {(["BDT", "USD"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={displayCcy === c}
                    onClick={() => setDisplayCcy(c)}
                    className={`${chipCls} ${
                      displayCcy === c
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {c === "BDT" ? "৳ BDT" : "$ USD"}
                  </button>
                ))}
              </>
            )}
            <button
              type="button"
              aria-pressed={onlyStarred}
              onClick={() => setOnlyStarred((v) => !v)}
              className={`${chipCls} ml-auto inline-flex items-center gap-1 ${
                onlyStarred
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${onlyStarred ? "fill-current" : ""}`}
              />
              প্রিয়
            </button>
          </div>

          {/* List */}
          {showSkeleton ? (
            <ul className="space-y-2" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <li
                  key={i}
                  className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse"
                />
              ))}
            </ul>
          ) : marketTab === "crypto" ? (
            <ul className="space-y-2">
              {filteredCrypto.length === 0 && (
                <li className="text-sm text-zinc-500 text-center py-8">
                  {onlyStarred
                    ? "এখনও কোনো প্রিয় কয়েন নেই। তারকা চিহ্নে ট্যাপ করুন।"
                    : "কোনো কয়েন পাওয়া যায়নি।"}
                </li>
              )}
              {filteredCrypto.map((coin) => {
                const positive = coin.change24h >= 0;
                const fav = starred.includes(coin.key);
                const magnitude = Math.min(100, Math.abs(coin.change24h) * 10);
                return (
                  <li
                    key={coin.key}
                    className={`${cardCls} flex items-stretch`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleStar(coin.key)}
                      aria-label={
                        fav
                          ? `${coin.name} প্রিয় থেকে সরান`
                          : `${coin.name} প্রিয়তে যোগ করুন`
                      }
                      aria-pressed={fav}
                      className="min-w-11 flex items-center justify-center text-zinc-300 dark:text-zinc-600 hover:text-amber-500 transition rounded-l-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                    >
                      <Star
                        className={`w-4 h-4 ${fav ? "fill-amber-400 text-amber-400" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => useInConverter(coin.key)}
                      className="flex-1 min-w-0 flex items-center justify-between gap-3 py-3 pr-4 text-left rounded-r-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                      title="কনভার্টারে ব্যবহার করুন"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                          {coin.symbol || coin.key.slice(0, 3)}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {coin.name}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            {coin.key}
                          </span>
                        </span>
                      </span>
                      <span className="text-right shrink-0">
                        <span className="block text-sm font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100">
                          {priceLabel(coin.priceUsd)}
                        </span>
                        <span
                          className={`mt-0.5 inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
                            positive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {positive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {positive ? "+" : ""}
                          {coin.change24h.toFixed(2)}%
                        </span>
                        <span
                          className="mt-1 block h-1 w-16 ml-auto rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
                          aria-hidden
                        >
                          <span
                            className={`block h-full rounded-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
                            style={{ width: `${magnitude}%` }}
                          />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-2">
              {filteredForex.length === 0 && (
                <li className="text-sm text-zinc-500 text-center py-8">
                  {onlyStarred
                    ? "এখনও কোনো প্রিয় মুদ্রা নেই।"
                    : "কোনো মুদ্রা পাওয়া যায়নি।"}
                </li>
              )}
              {filteredForex.map((code) => {
                const rate = data?.forex?.[code] ?? 0;
                const inBdt = rate > 0 ? bdtRate / rate : 0; // 1 CODE in BDT
                const fav = starred.includes(code);
                return (
                  <li key={code} className={`${cardCls} flex items-stretch`}>
                    <button
                      type="button"
                      onClick={() => toggleStar(code)}
                      aria-label={
                        fav
                          ? `${code} প্রিয় থেকে সরান`
                          : `${code} প্রিয়তে যোগ করুন`
                      }
                      aria-pressed={fav}
                      className="min-w-11 flex items-center justify-center text-zinc-300 dark:text-zinc-600 hover:text-amber-500 transition rounded-l-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                    >
                      <Star
                        className={`w-4 h-4 ${fav ? "fill-amber-400 text-amber-400" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => useInConverter(code)}
                      className="flex-1 min-w-0 flex items-center justify-between gap-3 py-3 pr-4 text-left rounded-r-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                      title="কনভার্টারে ব্যবহার করুন"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl" aria-hidden>
                          {flagOf(code)}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {code}
                          </span>
                          <span className="block text-xs text-zinc-500 tabular-nums">
                            ১ USD = {fmt(rate, { max: 4 })} {code}
                          </span>
                        </span>
                      </span>
                      <span className="text-right shrink-0">
                        <span className="block text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                          {code === "BDT" ? "—" : `৳${fmt(inBdt, { max: 2 })}`}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {code === "BDT" ? "বেস মুদ্রা" : `১ ${code} এর মূল্য`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-zinc-500 pt-1">
            <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
            রেট প্রতি ১ মিনিটে স্বয়ংক্রিয়ভাবে আপডেট হয়। এটি শুধু তথ্যের জন্য;
            লেনদেনের আগে নিজের এক্সচেঞ্জ বা ব্যাংকের রেট যাচাই করুন। কোনো সারিতে
            ট্যাপ করলে সেটি কনভার্টারে যাবে।
          </p>
        </section>
      )}
    </div>
  );
}
