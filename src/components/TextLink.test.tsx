import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ButtonLink, TextLink } from "./TextLink";

vi.mock("next/link", () => ({
  default({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

describe("TextLink", () => {
  it("enlaza rutas internas sin target externo", () => {
    render(<TextLink href="/trabajo">Volver a trabajo</TextLink>);

    const link = screen.getByRole("link", { name: "Volver a trabajo" });
    expect(link).toHaveAttribute("href", "/trabajo");
    expect(link).not.toHaveAttribute("target");
  });

  it("marca enlaces http como externos y accesibles", () => {
    render(
      <TextLink href="https://www.youtube.com/c/srodmode">YouTube</TextLink>,
    );

    const link = screen.getByRole("link", {
      name: /youtube.*pestaña nueva/i,
    });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("ButtonLink", () => {
  it("usa el estilo de botón en una ruta interna", () => {
    render(<ButtonLink href="/trabajo">Ver el trabajo</ButtonLink>);

    const link = screen.getByRole("link", { name: "Ver el trabajo" });
    expect(link).toHaveAttribute("href", "/trabajo");
    expect(link).toHaveClass("bg-accent", "text-accent-ink");
  });
});
