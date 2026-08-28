import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GalleryBox } from "./GalleryBox";

describe("GalleryBox", () => {
  it("enmarca el contenido en una caja de galería identificable", () => {
    render(
      <GalleryBox>
        <p>Still de rodaje: Sony FX3, 24mm</p>
      </GalleryBox>,
    );

    const box = screen
      .getByText("Still de rodaje: Sony FX3, 24mm")
      .closest('[data-ui="gallery-box"]');

    expect(box).not.toBeNull();
    expect(box).toHaveClass("bg-surface", "rounded-gallery", "shadow-gallery");
  });

  it("acepta otro elemento y clases adicionales sin perder la caja", () => {
    render(
      <GalleryBox as="figure" className="p-10">
        <figcaption>Prueba de cámara</figcaption>
      </GalleryBox>,
    );

    const box = screen
      .getByText("Prueba de cámara")
      .closest('[data-ui="gallery-box"]');

    expect(box?.tagName).toBe("FIGURE");
    expect(box).toHaveClass("p-10", "rounded-gallery");
  });
});
