"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

import { fadeVariants, prefersReducedMotion } from "@/lib/motion";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  if (!window.matchMedia) {
    return () => undefined;
  }
  const media = window.matchMedia(REDUCE_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => prefersReducedMotion(),
    () => false,
  );
}

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
