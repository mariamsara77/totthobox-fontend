import React from "react";
import Icon from "./Icon";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  title?: string;
  subtitle?: string;
  iconName?: string;
  actions?: React.ReactNode;
}

export function Section({
  id,
  title,
  subtitle,
  iconName,
  actions,
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-32 space-y-4 ${className}`}
      aria-labelledby={id && title ? `${id}-heading` : undefined}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {iconName && (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Icon name={iconName} size="xs" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h2
                  id={id ? `${id}-heading` : undefined}
                  className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate"
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      {children}
    </section>
  );
}

export default Section;
