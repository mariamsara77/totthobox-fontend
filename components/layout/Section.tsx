import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Section({
  children,
  className = "",
  title,
  description,
}: SectionProps) {
  return (
    <section className={`py-4 sm:py-6 space-y-3 sm:space-y-4 ${className}`}>
      {title && (
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          {description && (
            <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
