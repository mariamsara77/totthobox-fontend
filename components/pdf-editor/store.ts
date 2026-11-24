"use client";

import { create } from "zustand";
import { Annotation, PageState, Tool } from "./types";

interface PdfEditorStore {
  file: File | null;
  pdfDoc: any | null;
  numPages: number;
  currentPage: number;
  scale: number;
  tool: Tool;
  pages: Record<number, PageState>;
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  past: any[];
  future: any[];

  setFile: (file: File | null) => void;
  setPdfDoc: (doc: any) => void;
  setNumPages: (n: number) => void;
  setCurrentPage: (page: number) => void;
  setScale: (scale: number) => void;
  setTool: (tool: Tool) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setSelectedId: (id: string | null) => void;

  rotatePage: (pageIndex: number) => void;
  addAnnotation: (ann: Annotation) => void;
  updateAnnotation: (id: string, data: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  clearPageAnnotations: (pageIndex: number) => void;

  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  reset: () => void;
}

const createInitialPages = (num: number) => {
  const pages: Record<number, PageState> = {};
  for (let i = 0; i < num; i++) {
    pages[i] = { rotation: 0, annotations: [] };
  }
  return pages;
};

export const usePdfEditorStore = create<PdfEditorStore>((set, get) => ({
  file: null,
  pdfDoc: null,
  numPages: 0,
  currentPage: 1,
  scale: 1.25,
  tool: "select",
  pages: {},
  selectedId: null,
  isLoading: false,
  error: null,
  past: [],
  future: [],

  setFile: (file) => set({ file }),
  setPdfDoc: (pdfDoc) => set({ pdfDoc }),
  setNumPages: (numPages) =>
    set({
      numPages,
      pages: createInitialPages(numPages),
      currentPage: 1,
    }),
  setCurrentPage: (currentPage) => set({ currentPage, selectedId: null }),
  setScale: (scale) => set({ scale }),
  setTool: (tool) => set({ tool, selectedId: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedId: (selectedId) => set({ selectedId }),

  saveSnapshot: () => {
    const { pages, past } = get();
    set({
      past: [...past.slice(-40), JSON.parse(JSON.stringify(pages))],
      future: [],
    });
  },

  rotatePage: (pageIndex) => {
    get().saveSnapshot();
    set((state) => {
      const page = state.pages[pageIndex];
      if (!page) return state;
      return {
        pages: {
          ...state.pages,
          [pageIndex]: {
            ...page,
            rotation: (page.rotation + 90) % 360,
          },
        },
      };
    });
  },

  addAnnotation: (ann) => {
    get().saveSnapshot();
    set((state) => {
      const page = state.pages[ann.pageIndex] || { rotation: 0, annotations: [] };
      return {
        pages: {
          ...state.pages,
          [ann.pageIndex]: {
            ...page,
            annotations: [...page.annotations, ann],
          },
        },
        selectedId: ann.id,
      };
    });
  },

  updateAnnotation: (id, data) => {
    set((state) => {
      const newPages = { ...state.pages };
      Object.keys(newPages).forEach((key) => {
        const idx = Number(key);
        newPages[idx] = {
          ...newPages[idx],
          annotations: newPages[idx].annotations.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        };
      });
      return { pages: newPages };
    });
  },

  removeAnnotation: (id) => {
    get().saveSnapshot();
    set((state) => {
      const newPages = { ...state.pages };
      Object.keys(newPages).forEach((key) => {
        const idx = Number(key);
        newPages[idx] = {
          ...newPages[idx],
          annotations: newPages[idx].annotations.filter((a) => a.id !== id),
        };
      });
      return { pages: newPages, selectedId: null };
    });
  },

  clearPageAnnotations: (pageIndex) => {
    get().saveSnapshot();
    set((state) => {
      const page = state.pages[pageIndex];
      if (!page) return state;
      return {
        pages: {
          ...state.pages,
          [pageIndex]: { ...page, annotations: [] },
        },
        selectedId: null,
      };
    });
  },

  undo: () => {
    const { past, pages, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      pages: previous,
      past: past.slice(0, -1),
      future: [JSON.parse(JSON.stringify(pages)), ...future],
      selectedId: null,
    });
  },

  redo: () => {
    const { future, pages, past } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      pages: next,
      future: future.slice(1),
      past: [...past, JSON.parse(JSON.stringify(pages))],
      selectedId: null,
    });
  },

  reset: () =>
    set({
      file: null,
      pdfDoc: null,
      numPages: 0,
      currentPage: 1,
      scale: 1.25,
      tool: "select",
      pages: {},
      selectedId: null,
      isLoading: false,
      error: null,
      past: [],
      future: [],
    }),
}));