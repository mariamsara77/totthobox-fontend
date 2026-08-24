"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import {
  Search,
  Phone,
  MapPin,
  Share2,
  Copy,
  ShieldCheck,
  Heart,
  Flame,
  ChevronDown,
  Loader2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Category = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
};

type Contact = {
  id: number;
  name: string;
  phone?: string;
  alt_phone?: string;
  email?: string;
  address?: string;
  type?: string;
  designation?: string;
  division?: string;
  district?: string;
  thana?: string;
};

type Props = {
  category: Category;
};

export default function ContactClient({ category }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [thanaId, setThanaId] = useState("");
  const [types, setTypes] = useState<string[]>([]);

  const [divisions, setDivisions] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [thanas, setThanas] = useState<{ id: number; name: string }[]>([]);
  const [contactTypes, setContactTypes] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Load divisions + types
  useEffect(() => {
    fetch(`${API_BASE}/api/contacts/divisions`)
      .then((r) => r.json())
      .then((j) => setDivisions(j.data || []));

    fetch(`${API_BASE}/api/contacts/types?category_id=${category.id}`)
      .then((r) => r.json())
      .then((j) => setContactTypes(j.data || []));
  }, [category.id]);

  // Load districts when division changes
  useEffect(() => {
    setDistrictId("");
    setThanaId("");
    setThanas([]);
    if (!divisionId) {
      setDistricts([]);
      return;
    }
    fetch(`${API_BASE}/api/contacts/districts?division_id=${divisionId}`)
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []));
  }, [divisionId]);

  // Load thanas when district changes
  useEffect(() => {
    setThanaId("");
    if (!districtId) {
      setThanas([]);
      return;
    }
    fetch(`${API_BASE}/api/contacts/thanas?district_id=${districtId}`)
      .then((r) => r.json())
      .then((j) => setThanas(j.data || []));
  }, [districtId]);

  // Update URL when search changes (for SEO)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [debouncedSearch, pathname, router]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.meta?.has_more) return null;

    const params = new URLSearchParams();
    params.set("category_id", String(category.id));
    params.set("page", String(pageIndex + 1));
    params.set("per_page", "15");
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (divisionId) params.set("division_id", divisionId);
    if (districtId) params.set("district_id", districtId);
    if (thanaId) params.set("thana_id", thanaId);
    types.forEach((t) => params.append("types[]", t));

    return `${API_BASE}/api/contacts?${params.toString()}`;
  };

  const { data, size, setSize, isValidating, error } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  });

  const contacts: Contact[] = data ? data.flatMap((p) => p.data || []) : [];
  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;
  const total = data?.[0]?.meta?.total ?? 0;
  const isLoading = !data && !error;

  useEffect(() => {
    setSize(1);
  }, [debouncedSearch, divisionId, districtId, thanaId, types, setSize]);

  // Dynamic H1
  const divisionName = divisions.find((d) => String(d.id) === divisionId)?.name || "";
  const districtName = districts.find((d) => String(d.id) === districtId)?.name || "";
  const thanaName = thanas.find((t) => String(t.id) === thanaId)?.name || "";

  let h1 = `জরুরী ${category.name} ফোন নাম্বার`;
  let sub = "সারাদেশের গুরুত্বপূর্ণ জরুরী যোগাযোগ নম্বরসমূহ";

  if (debouncedSearch.trim()) {
    h1 = `"${debouncedSearch}" খোঁজার ফলাফল`;
    sub = `${category.name} বিভাগে মিল থাকা নম্বর`;
  } else if (thanaName) {
    h1 = `${thanaName} — ${category.name} নম্বর`;
    sub = [districtName, divisionName].filter(Boolean).join(", ");
  } else if (districtName) {
    h1 = `${districtName} জেলার ${category.name} নম্বর`;
    sub = divisionName ? `${divisionName} বিভাগ` : "জেলাভিত্তিক তালিকা";
  } else if (divisionName) {
    h1 = `${divisionName} বিভাগের ${category.name} নম্বর`;
    sub = "বিভাগভিত্তিক জরুরী যোগাযোগ";
  }

  const toggleType = (type: string) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getIcon = () => {
    if (category.name === "পুলিশ") return <ShieldCheck className="w-6 h-6 text-white" />;
    if (category.name === "হাসপাতাল") return <Heart className="w-6 h-6 text-white" />;
    if (category.name === "ফায়ার সার্ভিস") return <Flame className="w-6 h-6 text-white" />;
    return <Phone className="w-6 h-6 text-white" />;
  };

  const copyPhone = (phone: string, el: HTMLButtonElement) => {
    navigator.clipboard.writeText(phone);
    const original = el.innerText;
    el.innerText = "কপি হয়েছে!";
    setTimeout(() => (el.innerText = original), 2000);
  };

  const shareContact = async (contact: Contact) => {
    const location = [contact.thana, contact.district, contact.division]
      .filter(Boolean)
      .join(", ");
    const text = `${contact.name}${location ? ", " + location : ""}\n${contact.phone || ""}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: contact.name, text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert("কপি হয়েছে!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6 pb-20">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-2xl  font-bold tracking-tight text-zinc-50 text-zinc-100">
          {h1}
        </h1>
        <p className="text-base ">{sub}</p>
      </header>

      {/* Filters */}
      <nav className="bg-zinc-950 bg-zinc-800 rounded-xl p-4  border border-zinc-400/20 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম বা ঠিকানা দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-400/25  text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <select
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-400/25  text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            <option value="">সব বিভাগ</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            disabled={!divisionId}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-400/25  text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            <option value="">সব জেলা</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={thanaId}
            onChange={(e) => setThanaId(e.target.value)}
            disabled={!districtId}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-400/25  text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
          >
            <option value="">সব থানা</option>
            {thanas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {contactTypes.length > 0 && (
          <div className="pt-3 border-t border-zinc-400/20">
            <p className="text-xs  text-zinc-400 mb-2">ধরণ অনুযায়ী ফিল্টার</p>
            <div className="flex flex-wrap gap-2">
              {contactTypes.map((type) => (
                <label
                  key={type}
                  className="inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={types.includes(type)}
                    onChange={() => toggleType(type)}
                    className="rounded border-zinc-400"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Count */}
      <p className="text-sm text-zinc-400">
        মোট {total.toLocaleString("bn-BD")}টি ফলাফল পাওয়া গেছে
      </p>

      {/* List */}
      <section className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg ">কোনো নম্বর পাওয়া যায়নি</p>
            <p className="text-sm mt-1">অন্য ফিল্টার দিয়ে চেষ্টা করুন</p>
          </div>
        ) : (
          contacts.map((contact) => {
            const location = [contact.thana, contact.district, contact.division]
              .filter(Boolean)
              .join(", ");

            return (
              <article
                key={contact.id}
                className="rounded-2xl border border-zinc-400/25 bg-zinc-950 bg-zinc-900 p-4 space-y-4 hover: transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow shrink-0">
                    {getIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg  text-zinc-50 text-zinc-100">
                        {contact.name}
                      </h3>
                      {contact.type && (
                        <span className="px-2 py-0.5 rounded-md text-xs  bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {contact.type}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-400">
                      {location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {location}
                        </span>
                      )}
                      {contact.designation && (
                        <span>• {contact.designation}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-400/10/50 rounded-xl p-2 text-sm">
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="font-mono">{contact.phone}</span>
                    </div>
                  )}
                  {contact.alt_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-zinc-300">{contact.alt_phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2 col-span-full">
                      <span className="text-zinc-400">✉</span>
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-start gap-2 col-span-full">
                      <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-300">{contact.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-zinc-100 border-zinc-400/25">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-700 text-white text-sm  hover:bg-zinc-600"
                    >
                      <Phone className="w-4 h-4" />
                      কল করুন
                    </a>
                  )}
                  <button
                    onClick={() => shareContact(contact)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-400/30 text-sm  hover:bg-zinc-900 hover:bg-zinc-800"
                  >
                    <Share2 className="w-4 h-4" />
                    শেয়ার
                  </button>
                  {contact.phone && (
                    <button
                      onClick={(e) => copyPhone(contact.phone!, e.currentTarget)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-400/30 text-sm  hover:bg-zinc-900 hover:bg-zinc-800"
                    >
                      <Copy className="w-4 h-4" />
                      কপি
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-400/25 text-sm  disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                লোড হচ্ছে...
              </>
            ) : (
              "আরও দেখুন"
            )}
          </button>
        </div>
      )}

      {/* SEO Content */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-4">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          জরুরী {category.name} যোগাযোগ নম্বর সম্পর্কে
        </h2>
        <div className="text-sm leading-relaxed  space-y-4">
          <p>
            বাংলাদেশের সারাদেশের গুরুত্বপূর্ণ <strong>{category.name}</strong> যোগাযোগ নম্বর ও
            ঠিকানা এক জায়গায় খুঁজে নিন। বিভাগ, জেলা ও থানা অনুযায়ী ফিল্টার করে সহজেই প্রয়োজনীয়
            নম্বর পেয়ে যান।
          </p>
          <p>নম্বরে ক্লিক করে সরাসরি কল করতে পারবেন, কপি বা শেয়ারও করা যায়।</p>
        </div>
      </section>
    </div>
  );
}