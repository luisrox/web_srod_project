import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { Atmosphere } from "./Atmosphere";
import { StudioShell } from "./StudioShell";

const atmosphereCss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../styles/atmosphere.css"),
  "utf8",
);

describe("Atmosphere", () => {
  it("es decorativa: no interfiere con lectores de pantalla", () => {
    const { container } = render(<Atmosphere />);
    const layer = container.querySelector('[data-ui="atmosphere"]');

    expect(layer).not.toBeNull();
    expect(layer).toHaveAttribute("aria-hidden", "true");
  });

  it("el set público monta la capa detrás del contenido", () => {
    const { container } = render(
      <StudioShell>
        <p>Laboratorio</p>
      </StudioShell>,
    );

    const shell = container.querySelector('[data-ui="studio-shell"]');
    const atmosphere = shell?.querySelector('[data-ui="atmosphere"]');

    expect(atmosphere).not.toBeNull();
    expect(shell?.firstElementChild).toBe(atmosphere);
  });

  it("congela las luces si hay prefers-reduced-motion", () => {
    expect(atmosphereCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(atmosphereCss).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*animation:\s*none/,
    );
  });
});
