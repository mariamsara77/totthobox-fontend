"use client";

import dynamic from "next/dynamic";
import { useSearchModal } from "@/context/SearchModalContext";

const SearchModal = dynamic(() => import("@/components/search/SearchModal"), {
  ssr: false,
});

export default function SearchModalWrapper() {
  const { isSearchOpen, closeSearchModal } = useSearchModal();

  if (!isSearchOpen) return null;

  return <SearchModal onClose={closeSearchModal} />;
}
