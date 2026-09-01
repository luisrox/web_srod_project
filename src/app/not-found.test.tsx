import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import NotFound from "./not-found";

vi.mock("next/link", () => ({
  default({ href, children }: { href: string; children: ReactNode }) {
    return <a href={href}>{children}</a>;
  },
}));

describe("not-found", () => {
  it("muestra copy propio y enlaces a inicio y trabajo", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Página no encontrada" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Trabajo" })).toHaveAttribute(
      "href",
      "/trabajo",
    );
    expect(
      screen.queryByText(/this page could not be found/i),
    ).not.toBeInTheDocument();
  });
});
