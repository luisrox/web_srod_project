import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("apunta a #contenido y se anuncia en español", () => {
    render(<SkipLink />);

    expect(
      screen.getByRole("link", { name: "Saltar al contenido" }),
    ).toHaveAttribute("href", "#contenido");
    expect(screen.getByRole("link", { name: "Saltar al contenido" }).className).not.toMatch(
      /transition|animate-|duration-/,
    );
  });
});
