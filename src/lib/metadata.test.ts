import { describe, expect, it } from "vitest";

import { homePageTitle, pageTitle } from "./metadata";
import { SITE_NAME } from "./site";

const innerSegments = [
  "Recomendados",
  "Trabajo",
  "Kit",
  "Sobre",
  "Contacto",
  "Privacidad",
] as const;

describe("pageTitle", () => {
  it("produce titles únicos tipo «Trabajo — Srod Almenara»", () => {
    expect(pageTitle("Recomendados")).toBe("Recomendados — Srod Almenara");
    expect(pageTitle("Trabajo")).toBe("Trabajo — Srod Almenara");
    expect(pageTitle("Kit")).toBe("Kit — Srod Almenara");
    expect(pageTitle("Sobre")).toBe("Sobre — Srod Almenara");
    expect(pageTitle("Contacto")).toBe("Contacto — Srod Almenara");
    expect(pageTitle("Privacidad")).toBe("Privacidad — Srod Almenara");

    const titles = innerSegments.map((segment) => pageTitle(segment));
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe("homePageTitle", () => {
  it("combina wordmark y titular, sin copiar el title de las demás rutas", () => {
    const heroTitle = "Un DP bien geek que hace videos en YouTube";
    const home = homePageTitle(heroTitle);

    expect(home).toBe(`${SITE_NAME} — ${heroTitle}`);
    expect(home).not.toBe(SITE_NAME);

    for (const segment of innerSegments) {
      expect(home).not.toBe(pageTitle(segment));
    }
  });
});
