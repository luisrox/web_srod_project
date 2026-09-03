import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Reveal } from "./Reveal";

describe("Reveal", () => {
  it("deja el contenido visible y marca data-shown al entrar", () => {
    render(
      <Reveal>
        <p>Bloque del home</p>
      </Reveal>,
    );

    expect(screen.getByText("Bloque del home")).toBeVisible();
    expect(document.querySelector('[data-ui="reveal"]')).toHaveAttribute(
      "data-shown",
      "true",
    );
  });
});
