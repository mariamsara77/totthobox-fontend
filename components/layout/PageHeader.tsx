import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`space-y-3 border-b border-zinc-200 pb-6 sm:pb-8 dark:border-zinc-800 ${className}`}
    >
      {badge && <div className="inline-flex">{badge}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold leading-snug tracking-tight text-zinc-900 sm:text-3xl md:text-4xl dark:text-zinc-50">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 sm:gap-3">{actions}</div>}
      </div>
    </header>
  );
}
