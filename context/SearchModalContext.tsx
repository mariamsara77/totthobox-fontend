"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface SearchModalContextType {
  isSearchOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(
  undefined,
);

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearchModal = useCallback(() => setIsSearchOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchOpen(false), []);

  return (
    <SearchModalContext.Provider
      value={{ isSearchOpen, openSearchModal, closeSearchModal }}
    >
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (!context) {
    throw new Error("useSearchModal must be used within SearchModalProvider");
  }
  return context;
}
