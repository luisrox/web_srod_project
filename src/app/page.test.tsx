import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StudioShell } from "@/components/StudioShell";
import { SITE_NAME } from "@/lib/site";

import Home from "./page";

describe("Home", () => {
  it("renderiza el wordmark como encabezado principal", () => {
    render(
      <StudioShell>
        <Home />
      </StudioShell>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: SITE_NAME }),
    ).toBeVisible();
  });

  it("muestra el wordmark dentro de una caja de galería sobre el fondo tokenizado", () => {
    render(
      <StudioShell>
        <Home />
      </StudioShell>,
    );

    const heading = screen.getByRole("heading", { level: 1, name: SITE_NAME });

    expect(heading.closest('[data-ui="gallery-box"]')).not.toBeNull();
    expect(heading.closest('[data-ui="studio-shell"]')).toHaveClass(
      "bg-bg",
      "text-ink",
      "font-body",
    );
  });
});
