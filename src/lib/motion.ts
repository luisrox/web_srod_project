import { useSyncExternalStore } from "react";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(
  media: Pick<Window, "matchMedia"> | undefined = globalThis.window,
): boolean {
  if (!media?.matchMedia) {
    return false;
  }
  return media.matchMedia(REDUCE_QUERY).matches;
}

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => undefined;
  }
  const media = window.matchMedia(REDUCE_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => prefersReducedMotion(),
    () => false,
  );
}

export function fadeTransition(reduce: boolean) {
  return reduce
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeOut" as const };
}

export function fadeVariants(reduce: boolean) {
  if (reduce) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      transition: fadeTransition(true),
    };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: fadeTransition(false),
  };
}

export function parallaxOffset(
  reduce: boolean,
  scrollY: number,
  factor = 0.08,
): number {
  if (reduce) {
    return 0;
  }
  return Math.round(scrollY * factor);
}
