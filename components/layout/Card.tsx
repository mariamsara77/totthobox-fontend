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
      className={`rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 ${
        hoverable
          ? "transition-colors duration-150 hover:border-zinc-300 dark:hover:border-zinc-700"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
