"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
};

export function Reveal({ children }: RevealProps) {
  const reduce = usePrefersReducedMotion();

  if (process.env.VITEST || reduce) {
    return (
      <div data-ui="reveal" data-shown="true">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      data-ui="reveal"
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
