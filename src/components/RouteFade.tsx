"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { fadeVariants, usePrefersReducedMotion } from "@/lib/motion";

export function RouteFade({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const reduce = usePrefersReducedMotion();
  const variants = fadeVariants(reduce);

  if (pathname.startsWith("/studio")) {
    return children;
  }

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      transition={variants.transition}
    >
      {children}
    </motion.div>
  );
}
