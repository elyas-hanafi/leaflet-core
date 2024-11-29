"use client";

import { cn } from "@/lib/utils";
// eslint-disable-next-line no-restricted-imports
import {
  Icon as Iconify,
  type IconProps as IconifyProps,
} from "@iconify/react";

type IconProps = IconifyProps;

export function Icon(props: IconProps) {
  return (
    <Iconify {...props} className={cn("size-6 shrink-0", props.className)} />
  );
}
