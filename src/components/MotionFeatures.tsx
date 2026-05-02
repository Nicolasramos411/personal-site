"use client";

import { LazyMotion, domMax } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app tree to enable framer-motion's tree-shakable bundle.
 * Uses `domMax` because we need `layout` and `layoutId` features
 * (nav underline + chat container). Replace `motion.*` with `m.*`
 * everywhere — strict mode rejects the eager `motion` namespace.
 */
export function MotionFeatures({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
