import React from "react";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import Chip from "./Chip";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`space-y-3 pb-6 border-b border-zinc-200/80 dark:border-zinc-800 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-2" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            {badge && (
              <Chip variant="primary" size="sm">
                {badge}
              </Chip>
            )}
          </div>

          {description && (
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-[1.75]">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export default PageHeader;
