import React from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom";
}

export function Tooltip({
  content,
  children,
  position = "top",
}: TooltipProps): React.ReactElement {
  const positionClass =
    position === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-1.5"
      : "top-full left-1/2 -translate-x-1/2 mt-1.5";

  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${positionClass} z-50 whitespace-nowrap rounded-lg border border-[var(--surface-border)] bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 motion-reduce:transition-none group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 dark:bg-zinc-800`}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
