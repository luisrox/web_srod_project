import { describe, expect, it, vi } from "vitest";

import { SITE_NAME } from "@/lib/site";

// next/font sólo existe bajo el compilador de Next; en Vitest se sustituye por
// los objetos que devuelve el loader (className + variable).
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter", variable: "font-srod-body" }),
  Space_Grotesk: () => ({
    className: "space-grotesk",
    variable: "font-srod-display",
  }),
}));

const { metadata } = await import("./layout");
const { fontVariables } = await import("@/styles/fonts");

describe("layout raíz", () => {
  it("declara el title provisional con el wordmark", () => {
    expect(metadata.title).toBe(SITE_NAME);
  });

  it("expone las variables de fuente que consumen los tokens", () => {
    expect(fontVariables).toContain("font-srod-display");
    expect(fontVariables).toContain("font-srod-body");
  });
});
