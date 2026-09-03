"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
};

export function Reveal({ children }: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(
    Boolean(process.env.VITEST) || reduce,
  );

  useEffect(() => {
    if (process.env.VITEST || reduce) {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "80px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} data-ui="reveal" data-shown={shown ? "true" : "false"}>
      {children}
    </div>
  );
}
