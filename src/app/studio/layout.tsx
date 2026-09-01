import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Studio",
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
