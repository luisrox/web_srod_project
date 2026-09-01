import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrivacidadPage from "./page";

describe("página /privacidad", () => {
  it("explica el formulario en español, sin política anglosajona genérica", () => {
    render(<PrivacidadPage />);

    const page = document.body.textContent ?? "";

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacidad" }),
    ).toBeVisible();
    expect(page).toMatch(/formulario de contacto/i);
    expect(page).toMatch(/nombre/);
    expect(page).toMatch(/email/);
    expect(page).toMatch(/responder/);
    expect(page).toMatch(/cookies de marketing/i);
    expect(page).not.toMatch(/we collect/i);
    expect(page).not.toMatch(/cookie policy/i);
    expect(page).not.toMatch(/GDPR/i);
  });
});
