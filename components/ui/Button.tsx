import React from "react";
import Icon from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: string;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent-primary)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  outline:
    "border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5 rounded-lg min-h-9",
  md: "h-11 px-4 text-sm gap-2 rounded-xl min-h-11",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl min-h-12",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconName,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-[background-color,color,border-color,transform] duration-150 motion-reduce:transition-none active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <Icon name="Loader2" size="xs" className="animate-spin" />
        ) : iconName && iconPosition === "left" ? (
          <Icon name={iconName} size={size === "lg" ? "sm" : "xs"} />
        ) : null}

        <span>{children}</span>

        {!isLoading && iconName && iconPosition === "right" && (
          <Icon name={iconName} size={size === "lg" ? "sm" : "xs"} />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
