import type { ReactNode } from "react";

import { Atmosphere } from "@/components/Atmosphere";

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div
      data-ui="studio-shell"
      className="relative isolate flex min-h-screen flex-col font-body text-ink antialiased"
    >
      <Atmosphere />
      {children}
    </div>
  );
}
