"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchItem, SearchResponse, MetaResponse } from "@/types/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function useDebounce<T>(value: T, delay = 280): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useGlobalSearch() {
  const abortRef = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [results, setResults] = useState<SearchItem[]>([]);
  const [scope, setScope] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prefixes, setPrefixes] = useState<string[]>([]);
  const [hints, setHints] = useState<Record<string, string>>({});

  const queryTooShort = search.trim().length < 2;
  const showInitial = queryTooShort && !hasSearched;
  const showResults = !queryTooShort && results.length > 0;
  const showNoResults =
    !queryTooShort && hasSearched && !loading && results.length === 0;

  // Meta
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/search/meta`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? (r.json() as Promise<MetaResponse>) : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setPrefixes(data.prefixes || []);
        setHints(data.hints || {});
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setMetaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchResults = useCallback(async (query: string, nextLimit: number) => {
    abortRef.current?.abort();

    if (query.trim().length < 2) {
      setResults([]);
      setScope(null);
      setTotal(0);
      setHasMore(false);
      setLoading(false);
      setHasSearched(query.trim().length >= 2);
      loadingMoreRef.current = false;
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(query.trim())}&limit=${nextLimit}`,
        { signal: controller.signal, headers: { Accept: "application/json" } },
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as SearchResponse;
      if (controller.signal.aborted) return;

      setResults(Array.isArray(data.items) ? data.items : []);
      setScope(data.scope || null);
      setTotal(Number(data.total) || 0);
      setHasMore(Boolean(data.hasMore));
      setSelectedIndex(0);
      setHasSearched(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setResults([]);
      setScope(null);
      setTotal(0);
      setHasMore(false);
      setHasSearched(true);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        loadingMoreRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    setLimit(10);
    fetchResults(debouncedSearch, 10);
  }, [debouncedSearch, fetchResults]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    const next = limit + 10;
    setLimit(next);
    fetchResults(debouncedSearch, next);
  }, [debouncedSearch, fetchResults, hasMore, limit, loading]);

  const clearSearch = useCallback(() => {
    setSearch("");
    setResults([]);
    setHasSearched(false);
    setSelectedIndex(0);
  }, []);

  const choosePrefix = useCallback((prefix: string) => {
    setSearch(`${prefix}:`);
    setHasSearched(false);
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    // state
    search,
    setSearch,
    results,
    scope,
    total,
    hasMore,
    loading,
    hasSearched,
    metaLoading,
    selectedIndex,
    setSelectedIndex,
    prefixes,
    hints,
    queryTooShort,
    showInitial,
    showResults,
    showNoResults,

    // actions
    fetchResults,
    loadMore,
    clearSearch,
    choosePrefix,
    abort,
    limit,
  };
}