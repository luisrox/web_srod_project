import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  children: ReactNode;
};

export function PageShell({ title, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-section">
      <h1 className="font-display text-4xl font-medium tracking-tight">{title}</h1>
      <div className="mt-4 space-y-8">{children}</div>
    </div>
  );
}
