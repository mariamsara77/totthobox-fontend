import React from "react";
import { Chip, type ChipProps, type ChipSize, type ChipVariant } from "./Chip";

export type BadgeVariant = ChipVariant;
export type BadgeSize = ChipSize;
export type BadgeProps = ChipProps;

export function Badge(props: BadgeProps): React.ReactElement {
  return <Chip {...props} />;
}

export default Badge;
