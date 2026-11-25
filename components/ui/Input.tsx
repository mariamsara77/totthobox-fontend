import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      leftAdornment,
      rightAdornment,
      className = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAdornment && (
            <span className="pointer-events-none absolute left-3 flex items-center text-zinc-500 dark:text-zinc-400">
              {leftAdornment}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={describedBy}
            className={`min-h-11 w-full rounded-xl border bg-[var(--surface-card)] px-3.5 py-2.5 text-base md:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? "border-rose-500 dark:border-rose-400"
                : "border-[var(--surface-border)] hover:border-zinc-300 dark:hover:border-zinc-700"
            } ${leftAdornment ? "pl-10" : ""} ${rightAdornment ? "pr-10" : ""} ${className}`}
            {...props}
          />

          {rightAdornment && (
            <span className="absolute right-3 flex items-center text-zinc-500 dark:text-zinc-400">
              {rightAdornment}
            </span>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-rose-600 dark:text-rose-400"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-[var(--text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
