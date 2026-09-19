"use client";

import { useSearchModal } from "@/context/SearchModalContext";
import SearchModal from "@/components/search/SearchModal";

export default function SearchModalWrapper() {
  const { isSearchOpen, closeSearchModal } = useSearchModal();

  if (!isSearchOpen) return null;

  return <SearchModal onClose={closeSearchModal} />;
}
