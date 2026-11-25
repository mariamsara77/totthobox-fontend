"use client";

import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
  closeLabel?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidthClassName = "max-w-md",
  closeLabel = "বন্ধ করুন",
}: ModalProps): React.ReactElement | null {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/50 transition-opacity duration-150 motion-reduce:transition-none"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative z-10 w-full ${maxWidthClassName} rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-5 text-[var(--text-primary)] shadow-[var(--shadow-md)] focus-visible:outline-none`}
      >
        {(title || description) && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              {title && (
                <h2
                  id={titleId}
                  className="text-base font-semibold text-[var(--text-primary)]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className="text-xs text-[var(--text-secondary)]"
                >
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
