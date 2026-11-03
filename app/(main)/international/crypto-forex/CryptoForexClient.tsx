"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { ArrowRightLeft, TrendingUp, TrendingDown, RefreshCw, DollarSign, Coins, Globe, ArrowUpRight } from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import { ShareToolButton, CopyResultButton } from "@/components/tools/ToolActions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CryptoForexClient() {
  const { data, error, isLoading, mutate } = useSWR("/api/crypto-forex", fetcher, {
    refreshInterval: 60000, // auto-refresh every 60s
    revalidateOnFocus: false,
  });

  const [amount, setAmount] = useState<string>("1");
  const [fromAsset, setFromAsset] = useState<string>("BTC");
  const [toAsset, setToAsset] = useState<string>("BDT");

  // Crypto list
  const cryptoList = useMemo(() => {
    if (!data?.crypto) return [];
    return Object.entries(data.crypto).map(([symbol, info]: [string, any]) => ({
      symbol,
      name: info.name,
      priceUsd: info.priceUsd,
      change24h: info.change24h,
      icon: info.symbol,
    }));
  }, [data?.crypto]);

  // Forex list
  const forexList = useMemo(() => {
    if (!data?.forex) return [];
    return Object.entries(data.forex).map(([code, rate]: [string, any]) => ({
      code,
      rateVsUsd: rate,
    }));
  }, [data?.forex]);

  // Asset price in USD
  const getAssetPriceUsd = (assetKey: string): number => {
    if (data?.crypto && data.crypto[assetKey]) {
      return data.crypto[assetKey].priceUsd;
    }
    if (data?.forex && data.forex[assetKey]) {
      // 1 USD = rate units of fiat, so 1 fiat = (1 / rate) USD
      const rate = data.forex[assetKey];
      return rate > 0 ? 1 / rate : 0;
    }
    return 1;
  };

  // Convert
  const conversionResult = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return null;

    const fromPriceUsd = getAssetPriceUsd(fromAsset);
    const toPriceUsd = getAssetPriceUsd(toAsset);

    if (toPriceUsd <= 0) return null;

    const result = (num * fromPriceUsd) / toPriceUsd;

    return {
      result,
      formatted: result.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: result < 0.01 ? 6 : 4,
      }),
      fromLabel: fromAsset,
      toLabel: toAsset,
    };
  }, [amount, fromAsset, toAsset, data]);

  const swapAssets = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
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

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          লাইভ ক্রিপ্টো ও ফরেক্স এক্সচেঞ্জ রেট
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          বিটকয়েন, ইথেরিয়াম, ইউএসডিটি সহ শীর্ষ ক্রিপ্টোকারেন্সি এবং বিডিটি, ইউএসডি, ইউরো, রিয়াল মুদ্রার রিয়েল-টাইম লাইভ মূল্য ও রূপান্তর।
        </p>
      </header>

      {/* Main Converter Card */}
      <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            লাইভ কনভার্টার
          </h2>
          <button
            type="button"
            onClick={() => mutate()}
            aria-label="রেট রিফ্রেশ করুন"
            className="flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>আপডেট রেট</span>
          </button>
        </div>

        {/* Inputs & Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
          {/* From */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              যে মুদ্রা / ক্রিপ্টো থেকে (From)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="পরিমাণ"
                className="w-1/2 min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-base sm:text-sm font-semibold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
              />
              <select
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
                className="w-1/2 min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
              >
                <optgroup label="ক্রিপ্টোকারেন্সি">
                  {cryptoList.map((c) => (
                    <option key={`from-${c.symbol}`} value={c.symbol}>
                      {c.symbol} - {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="ফিয়াট মুদ্রা">
                  {forexList.map((f) => (
                    <option key={`from-${f.code}`} value={f.code}>
                      {f.code}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="sm:col-span-1 flex justify-center py-1 sm:pt-6">
            <button
              type="button"
              onClick={swapAssets}
              aria-label="মুদ্রা অদলবদল করুন"
              title="অদলবদল করুন"
              className="min-h-[44px] min-w-[44px] rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex items-center justify-center shadow-xs"
            >
              <ArrowRightLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>

          {/* To */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              যে মুদ্রায় রূপান্তর (To)
            </label>
            <select
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
            >
              <optgroup label="ফিয়াট মুদ্রা">
                {forexList.map((f) => (
                  <option key={`to-${f.code}`} value={f.code}>
                    {f.code}
                  </option>
                ))}
              </optgroup>
              <optgroup label="ক্রিপ্টোকারেন্সি">
                {cryptoList.map((c) => (
                  <option key={`to-${c.symbol}`} value={c.symbol}>
                    {c.symbol} - {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Result Card */}
        {conversionResult && (
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 sm:p-6 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              রূপান্তরিত মূল্য
            </span>
            <div className="flex flex-wrap items-baseline justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tabular-nums">
                {conversionResult.formatted}
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {conversionResult.toLabel}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              ১ {fromAsset} = {((1 * getAssetPriceUsd(fromAsset)) / getAssetPriceUsd(toAsset)).toLocaleString("en-US", { maximumFractionDigits: 4 })} {toAsset}
            </p>

            <div className="flex justify-center pt-2">
              <CopyResultButton
                textToCopy={`${amount} ${fromAsset} = ${conversionResult.formatted} ${toAsset}`}
                label="ফলাফল কপি করুন"
              />
            </div>
          </div>
        )}
      </section>

      {/* Top Crypto Tickers Grid */}
      <section aria-label="শীর্ষ ক্রিপ্টোকারেন্সির লাইভ মূল্য" className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          শীর্ষ ক্রিপ্টোকারেন্সির লাইভ রেট
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {cryptoList.map((coin) => {
            const isPositive = coin.change24h >= 0;
            const priceInBdt = coin.priceUsd * (data?.forex?.BDT || 122.5);

            return (
              <article
                key={coin.symbol}
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between min-h-[130px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      {coin.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {coin.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500">{coin.symbol}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isPositive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? "+" : ""}
                    {coin.change24h.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    ${coin.priceUsd.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    ≈ ৳{priceInBdt.toLocaleString(undefined, { maximumFractionDigits: 0 })} BDT
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
