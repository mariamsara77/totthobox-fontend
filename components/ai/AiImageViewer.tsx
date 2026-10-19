"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const AiImageLightbox = dynamic(() => import("./AiImageLightbox"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  src: string;
  alt?: string;
  children: ReactNode;
};

export default function AiImageViewer({ src, alt = "", children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={
          alt ? `ছবিটি পূর্ণ আকারে দেখুন: ${alt}` : "ছবিটি পূর্ণ আকারে দেখুন"
        }
        className="inline-flex max-w-full cursor-zoom-in rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
      >
        {children}
      </button>

      {isOpen && (
        <AiImageLightbox
          src={src}
          alt={alt}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
