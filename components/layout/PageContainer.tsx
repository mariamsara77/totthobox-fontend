import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide" | "full";
}

const sizeClasses = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-full",
};

export default function PageContainer({
  children,
  className = "",
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}
