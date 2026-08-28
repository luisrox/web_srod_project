import type { ReactNode } from "react";

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div
      data-ui="studio-shell"
      className="min-h-screen bg-bg font-body text-ink antialiased"
    >
      {children}
    </div>
  );
}
