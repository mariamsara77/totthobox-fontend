import React from "react";
import * as LucideIcons from "lucide-react";

export type IconSize = "xs" | "sm" | "md" | "lg";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: IconSize | number;
  className?: string;
  strokeWidth?: number;
}

const SIZE_MAP: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
};

export function Icon({
  name,
  size = "md",
  className = "",
  strokeWidth = 2,
  ...rest
}: IconProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 24;

  // Resolve icon component from lucide-react dynamically
  const IconMap = LucideIcons as unknown as Record<
    string,
    React.ComponentType<LucideIcons.LucideProps>
  >;
  const IconComponent = IconMap[name] || LucideIcons.HelpCircle;

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...rest}
    />
  );
}

export default Icon;
