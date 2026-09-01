import type { ReactNode } from "react";

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div
      data-ui="studio-shell"
      className="flex min-h-screen flex-col bg-bg font-body text-ink antialiased"
    >
      {children}
    </div>
  );
}
