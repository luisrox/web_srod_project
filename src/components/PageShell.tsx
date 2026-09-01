import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  children: ReactNode;
  /** `narrow` es el ancho previo de Recomendados; el resto usa la columna ancha. */
  width?: "wide" | "narrow";
};

export function PageShell({
  title,
  children,
  width = "wide",
}: PageShellProps) {
  return (
    <div
      className={[
        "mx-auto px-6 py-section",
        width === "narrow" ? "max-w-3xl" : "max-w-6xl",
      ].join(" ")}
    >
      <h1 className="font-display text-4xl font-medium tracking-tight">{title}</h1>
      <div className="mt-4 space-y-8">{children}</div>
    </div>
  );
}
