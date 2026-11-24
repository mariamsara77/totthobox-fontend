"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        // Prevent default browser URL bar search / bookmark shortcut
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    return {
      isSearchOpen: false,
      openSearchModal: () => {},
      closeSearchModal: () => {},
    };
  }
  return context;
}
