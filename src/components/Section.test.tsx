import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "./Section";

describe("Section", () => {
  it("asocia el h2 con el region vía aria-labelledby", () => {
    render(
      <Section title="Video">
        <p>Contenido de la sección</p>
      </Section>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Video" });
    const region = screen.getByRole("region", { name: "Video" });

    expect(region).toContainElement(heading);
    expect(region).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("puede aclarar el rol de la sección con un intro", () => {
    render(
      <Section title="Proceso" intro="Últimos videos del canal.">
        <p>Feed</p>
      </Section>,
    );

    expect(screen.getByText("Últimos videos del canal.")).toBeVisible();
  });
});
