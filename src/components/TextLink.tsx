import Link from "next/link";
import type { ReactNode } from "react";

type AppLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function isHttpUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function mergeClass(base: string, extra?: string) {
  return [base, extra].filter(Boolean).join(" ");
}

function ExternalMarker() {
  return <span className="sr-only"> (se abre en una pestaña nueva)</span>;
}

export function TextLink({ href, children, className }: AppLinkProps) {
  const classes = mergeClass(
    "text-accent underline-offset-4 hover:underline",
    className,
  );

  if (isHttpUrl(href)) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={classes}
      >
        {children}
        <ExternalMarker />
      </a>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function ButtonLink({ href, children, className }: AppLinkProps) {
  const classes = mergeClass(
    "inline-flex min-h-11 items-center justify-center rounded-gallery bg-accent px-4 text-sm font-medium text-accent-ink hover:opacity-90",
    className,
  );

  if (isHttpUrl(href)) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={classes}
      >
        {children}
        <ExternalMarker />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
