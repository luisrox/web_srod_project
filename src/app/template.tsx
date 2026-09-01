import { RouteFade } from "@/components/RouteFade";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <RouteFade>{children}</RouteFade>;
}
