import React from "react";
import Icon from "./Icon";

export type ChipVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline";
export type ChipSize = "sm" | "md";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  iconName?: string;
}

const VARIANT_MAP: Record<ChipVariant, string> = {
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  primary: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
  outline: "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-transparent",
};

const SIZE_MAP: Record<ChipSize, string> = {
  sm: "px-2 py-0.5 text-2xs gap-1 rounded-md",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
};

export function Chip({
  variant = "default",
  size = "md",
  iconName,
  className = "",
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wide ${VARIANT_MAP[variant]} ${SIZE_MAP[size]} ${className}`}
      {...props}
    >
      {iconName && <Icon name={iconName} size={size === "sm" ? 10 : 12} />}
      <span>{children}</span>
    </span>
  );
}

export default Chip;
