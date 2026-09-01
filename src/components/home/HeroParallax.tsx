"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { parallaxOffset, prefersReducedMotion } from "@/lib/motion";

export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) {
      return;
    }

    const onScroll = () => {
      node.style.transform = `translate3d(0, ${parallaxOffset(false, window.scrollY)}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} data-ui="hero-media">
      {children}
    </div>
  );
}
