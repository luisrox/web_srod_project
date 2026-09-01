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
});
