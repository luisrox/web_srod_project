import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SITE_NAME } from "@/lib/site";

import Home from "./page";

describe("Home", () => {
  it("renderiza el wordmark como encabezado principal", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: SITE_NAME }),
    ).toBeVisible();
  });
});
