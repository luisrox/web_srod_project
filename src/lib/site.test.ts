import { describe, expect, it } from "vitest";

import { SITE_LANG, SITE_NAME } from "@/lib/site";

describe("constantes de marca (vía alias @/)", () => {
  it("el alias @/ resuelve a src/", () => {
    expect(SITE_NAME).toBeDefined();
  });

  it("expone el wordmark del sitio", () => {
    expect(SITE_NAME).toBe("Srod Almenara");
  });

  it("expone el idioma del producto", () => {
    expect(SITE_LANG).toBe("es");
  });
});
