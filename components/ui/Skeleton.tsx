import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded-md h-4 w-full",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${variantClasses[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

export default Skeleton;
