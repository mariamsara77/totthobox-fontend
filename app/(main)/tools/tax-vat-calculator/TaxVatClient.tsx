"use client";

import { useState, useMemo } from "react";
import { Receipt, Calculator, Percent, DollarSign, Check, HelpCircle, ShieldCheck } from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import { ShareToolButton, CopyResultButton } from "@/components/tools/ToolActions";

type TaxCategory = "general" | "female_senior" | "disabled" | "freedom_fighter";
type LocationZone = "metro" | "other_city" | "rural";

const CATEGORY_THRESHOLDS: Record<TaxCategory, number> = {
  general: 350000,
  female_senior: 400000,
  disabled: 475000,
  freedom_fighter: 500000,
};

const MINIMUM_TAX_MAP: Record<LocationZone, number> = {
  metro: 5000,
  other_city: 4000,
  rural: 3000,
};

export default function TaxVatClient() {
  const [activeTab, setActiveTab] = useState<"tax" | "vat">("tax");

  // Income Tax States
  const [annualIncome, setAnnualIncome] = useState<string>("600000");
  const [taxCategory, setTaxCategory] = useState<TaxCategory>("general");
  const [locationZone, setLocationZone] = useState<LocationZone>("metro");
  const [investment, setInvestment] = useState<string>("50000");

  // VAT States
  const [vatAmount, setVatAmount] = useState<string>("1000");
  const [vatRate, setVatRate] = useState<string>("15");
  const [vatMode, setVatMode] = useState<"exclusive" | "inclusive">("exclusive");

  // ---------- Income Tax Calculations (NBR Bangladesh Rules) ----------
  const taxCalculation = useMemo(() => {
    const income = parseFloat(annualIncome) || 0;
    const inv = parseFloat(investment) || 0;
    const threshold = CATEGORY_THRESHOLDS[taxCategory];
    const minTax = MINIMUM_TAX_MAP[locationZone];

    if (income <= threshold) {
      return {
        taxableIncome: 0,
        grossTax: 0,
        rebate: 0,
        netTax: 0,
        slabs: [],
        effectiveRate: 0,
        isZeroTax: true,
      };
    }

    let remaining = income - threshold;
    const taxableIncome = remaining;
    let grossTax = 0;
    const slabs: { label: string; amount: number; rate: number; tax: number }[] = [];

    // Slabs:
    // 1st Next 1,00,000 @ 5%
    const s1 = Math.min(remaining, 100000);
    if (s1 > 0) {
      const t = s1 * 0.05;
      grossTax += t;
      slabs.push({ label: "পরবর্তী ১,০০,০০০ টাকা", amount: s1, rate: 5, tax: t });
      remaining -= s1;
    }

    // 2nd Next 4,00,000 @ 10%
    const s2 = Math.min(remaining, 400000);
    if (s2 > 0) {
      const t = s2 * 0.1;
      grossTax += t;
      slabs.push({ label: "পরবর্তী ৪,০০,০০০ টাকা", amount: s2, rate: 10, tax: t });
      remaining -= s2;
    }

    // 3rd Next 5,00,000 @ 15%
    const s3 = Math.min(remaining, 500000);
    if (s3 > 0) {
      const t = s3 * 0.15;
      grossTax += t;
      slabs.push({ label: "পরবর্তী ৫,০০,০০০ টাকা", amount: s3, rate: 15, tax: t });
      remaining -= s3;
    }

    // 4th Next 5,00,000 @ 20%
    const s4 = Math.min(remaining, 500000);
    if (s4 > 0) {
      const t = s4 * 0.2;
      grossTax += t;
      slabs.push({ label: "পরবর্তী ৫,০০,০০০ টাকা", amount: s4, rate: 20, tax: t });
      remaining -= s4;
    }

    // Rest @ 25%
    if (remaining > 0) {
      const t = remaining * 0.25;
      grossTax += t;
      slabs.push({ label: "অবশিষ্ট আয়ের ওপর", amount: remaining, rate: 25, tax: t });
    }

    // Investment Tax Rebate (15% on eligible investment up to limits)
    const maxAllowableInvestment = taxableIncome * 0.2;
    const eligibleInvestment = Math.min(inv, maxAllowableInvestment);
    const rebate = Math.min(eligibleInvestment * 0.15, grossTax);

    let netTax = grossTax - rebate;
    if (netTax > 0 && netTax < minTax) {
      netTax = minTax;
    }

    const effectiveRate = income > 0 ? (netTax / income) * 100 : 0;

    return {
      taxableIncome,
      grossTax,
      rebate,
      netTax,
      slabs,
      effectiveRate,
      isZeroTax: false,
    };
  }, [annualIncome, taxCategory, locationZone, investment]);

  // ---------- VAT Calculations ----------
  const vatCalculation = useMemo(() => {
    const val = parseFloat(vatAmount) || 0;
    const rate = parseFloat(vatRate) || 0;

    if (val <= 0 || rate <= 0) {
      return { basePrice: 0, vatPayable: 0, totalPrice: 0 };
    }

    if (vatMode === "exclusive") {
      // Amount is base price
      const vatPayable = (val * rate) / 100;
      const totalPrice = val + vatPayable;
      return { basePrice: val, vatPayable, totalPrice };
    } else {
      // Amount already includes VAT
      const basePrice = val / (1 + rate / 100);
      const vatPayable = val - basePrice;
      return { basePrice, vatPayable, totalPrice: val };
    }
  }, [vatAmount, vatRate, vatMode]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Receipt className="w-3.5 h-3.5" />
            জাতীয় কর ও ভ্যাট গণনা টুল
          </span>
          <FavoriteButton
            tool={{
              id: "tax-vat-calculator",
              title: "আয়কর ও ভ্যাট ক্যালকুলেটর",
              path: "/tools/tax-vat-calculator",
              category: "টুলস",
            }}
          />
          <ShareToolButton title="বাংলাদেশ আয়কর ও ভ্যাট ক্যালকুলেটর - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          আয়কর ও ভ্যাট ক্যালকুলেটর
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          জাতীয় রাজস্ব বোর্ড (NBR) এর সর্বশেষ আয়কর স্লাব, বিনিয়োগ কর রেয়াত এবং ভ্যাট (VAT) নিখুঁতভাবে হিসাব করুন।
        </p>

        {/* Tab switch */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800/80">
            <button
              onClick={() => setActiveTab("tax")}
              className={`min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "tax"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Calculator className="w-4 h-4" />
              ব্যক্তিগত আয়কর হিসাব
            </button>
            <button
              onClick={() => setActiveTab("vat")}
              className={`min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "vat"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Percent className="w-4 h-4" />
              ভ্যাট (VAT) হিসাব
            </button>
          </div>
        </div>
      </header>

      {/* ========== TAB 1: INCOME TAX ========== */}
      {activeTab === "tax" && (
        <section aria-label="আয়কর ক্যালকুলেটর" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-6 space-y-5 shadow-xs">
            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  বার্ষিক মোট করযোগ্য আয় (টাকা)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="যেমন: 600000"
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-base sm:text-sm font-bold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  করদাতার ক্যাটাগরি
                </label>
                <select
                  value={taxCategory}
                  onChange={(e) => setTaxCategory(e.target.value as TaxCategory)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="general">সাধারণ পুরুষ করদাতা (করমুক্ত: ৩.৫ লাখ)</option>
                  <option value="female_senior">নারী ও ৬৫+ বছর বয়স্ক (করমুক্ত: ৪ লাখ)</option>
                  <option value="disabled">প্রতিবন্ধী / তৃতীয় লিঙ্গ (করমুক্ত: ৪.৭৫ লাখ)</option>
                  <option value="freedom_fighter">গেজেটভুক্ত বীর মুক্তিযোদ্ধা (করমুক্ত: ৫ লাখ)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  এলাকা / সিটি কর্পোরেশন
                </label>
                <select
                  value={locationZone}
                  onChange={(e) => setLocationZone(e.target.value as LocationZone)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="metro">ঢাকা ও চট্টগ্রাম সিটি কর্পোরেশন (ন্যূনতম কর ৫,০০০ ৳)</option>
                  <option value="other_city">অন্যান্য সিটি কর্পোরেশন (ন্যূনতম কর ৪,০০০ ৳)</option>
                  <option value="rural">সিটি কর্পোরেশন বহির্ভূত এলাকা (ন্যূনতম কর ৩,০০০ ৳)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  বার্ষিক কর রেয়াতযোগ্য বিনিয়োগ (টাকা)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="যেমন: সঞ্চয়পত্র, ডিপিএস বা জীবন বীমা"
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-base sm:text-sm font-bold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Tax Result Summary Card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 sm:p-6 text-center space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                মোট প্রদেয় আয়কর (Net Tax Payable)
              </span>

              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums">
                  ৳{taxCalculation.netTax.toLocaleString("bn-BD")}
                </span>
                <span className="text-sm font-semibold text-zinc-500">
                  (কার্যকরী কর হার: {taxCalculation.effectiveRate.toFixed(2)}%)
                </span>
              </div>

              {taxCalculation.isZeroTax ? (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                  আপনার মোট আয় করমুক্ত সীমার মধ্যে রয়েছে। কোনো কর দিতে হবে না!
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md mx-auto pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
                    <span className="text-zinc-500">গ্রস ট্যাক্স:</span>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      ৳{taxCalculation.grossTax.toLocaleString("bn-BD")}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
                    <span className="text-zinc-500">বিনিয়োগ রেয়াত:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      -৳{taxCalculation.rebate.toLocaleString("bn-BD")}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
                    <span className="text-zinc-500">করযোগ্য আয়:</span>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      ৳{taxCalculation.taxableIncome.toLocaleString("bn-BD")}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <CopyResultButton
                  textToCopy={`বার্ষিক আয়: ৳${annualIncome}, প্রদেয় মোট আয়কর: ৳${taxCalculation.netTax.toLocaleString("bn-BD")} (Totthobox Tax Calculator)`}
                  label="কর বিবরণী কপি করুন"
                />
              </div>
            </div>

            {/* Slabs breakdown */}
            {taxCalculation.slabs.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  ধাপে ধাপে স্লাব ভিত্তিক হিসাব
                </h3>
                <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                  {taxCalculation.slabs.map((slab, i) => (
                    <div key={i} className="flex justify-between p-3 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {slab.label} (৳{slab.amount.toLocaleString("bn-BD")} @ {slab.rate}%)
                      </span>
                      <strong className="text-zinc-900 dark:text-zinc-100">
                        ৳{slab.tax.toLocaleString("bn-BD")}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== TAB 2: VAT CALCULATOR ========== */}
      {activeTab === "vat" && (
        <section aria-label="ভ্যাট ক্যালকুলেটর" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-6 space-y-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  হিসাবের ধরন
                </label>
                <div className="flex rounded-xl bg-white dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700 min-h-[48px]">
                  <button
                    type="button"
                    onClick={() => setVatMode("exclusive")}
                    className={`flex-1 rounded-lg text-xs font-bold transition ${
                      vatMode === "exclusive"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    ভ্যাট ছাড়া (Exclusive)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVatMode("inclusive")}
                    className={`flex-1 rounded-lg text-xs font-bold transition ${
                      vatMode === "inclusive"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    ভ্যাটসহ (Inclusive)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  টাকার পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(e.target.value)}
                  placeholder="যেমন: 1000"
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-base sm:text-sm font-bold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  ভ্যাট হার (%)
                </label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-bold outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="15">১৫% (আদর্শ জাতীয় হার)</option>
                  <option value="10">১০% (বিশেষ সেবা)</option>
                  <option value="7.5">৭.৫% (রেস্তোরাঁ / অন্যান্য)</option>
                  <option value="5">৫% (উৎপাদন / পণ্য)</option>
                  <option value="2.4">২.৪% (জমি / রিয়েল এস্টেট)</option>
                </select>
              </div>
            </div>

            {/* VAT Result Box */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 sm:p-6 text-center space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                ভ্যাট হিসাব ফলাফল
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">মূল বা খাঁটি দাম (Net Price)</span>
                  <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1 tabular-nums">
                    ৳{vatCalculation.basePrice.toLocaleString("bn-BD", { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/30">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">ভ্যাট পরিমাণ ({vatRate}%)</span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                    ৳{vatCalculation.vatPayable.toLocaleString("bn-BD", { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">সর্বমোট প্রদেয় (Total Gross)</span>
                  <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1 tabular-nums">
                    ৳{vatCalculation.totalPrice.toLocaleString("bn-BD", { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <CopyResultButton
                  textToCopy={`মূল দাম: ৳${vatCalculation.basePrice.toFixed(2)}, ভ্যাট (${vatRate}%): ৳${vatCalculation.vatPayable.toFixed(2)}, সর্বমোট: ৳${vatCalculation.totalPrice.toFixed(2)} (Totthobox VAT Calculator)`}
                  label="ভ্যাট বিবরণী কপি করুন"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
