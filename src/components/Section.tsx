import type { ReactNode } from "react";
import { useId } from "react";

type SectionProps = {
  children: ReactNode;
  title?: string;
  intro?: string;
  className?: string;
  ui?: string;
};

export function Section({
  children,
  title,
  intro,
  className,
  ui,
}: SectionProps) {
  const headingId = useId();

  return (
    <section
      data-ui={ui ?? "section"}
      aria-labelledby={title ? headingId : undefined}
      className={className}
    >
      {title ? (
        <h2
          id={headingId}
          className="font-display text-2xl font-medium tracking-tight"
        >
          {title}
        </h2>
      ) : null}
      {intro ? (
        <p className="mt-2 max-w-prose text-muted">{intro}</p>
      ) : null}
      {children}
    </section>
  );
}
