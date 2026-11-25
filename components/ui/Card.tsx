import React from "react";

export type CardVariant = "default" | "elevated" | "flat" | "interactive";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING_MAP = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

const VARIANT_MAP: Record<CardVariant, string> = {
  default:
    "border border-zinc-200/80 dark:border-zinc-800 bg-[var(--surface-card)] shadow-[var(--shadow-xs)]",
  elevated:
    "border border-zinc-200/60 dark:border-zinc-800/80 bg-[var(--surface-card)] shadow-[var(--shadow-md)]",
  flat: "border-0 bg-[var(--surface-raised)] shadow-none",
  interactive:
    "border border-zinc-200/80 dark:border-zinc-800 bg-[var(--surface-card)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] hover:border-[var(--accent-soft-border)] hover:-translate-y-0.5 transition-[box-shadow,border-color,transform] duration-[var(--duration-normal)] motion-reduce:hover:translate-y-0 cursor-pointer",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", className = "", children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl ${VARIANT_MAP[variant]} ${PADDING_MAP[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
export default Card;
