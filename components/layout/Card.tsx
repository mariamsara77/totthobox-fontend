import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs ${
        hoverable
          ? "transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
