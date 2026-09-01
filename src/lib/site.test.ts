import { describe, expect, it } from "vitest";

import { HEADER_WORDMARK, SITE_LANG, SITE_NAME } from "@/lib/site";

describe("constantes de marca (vía alias @/)", () => {
  it("el alias @/ resuelve a src/", () => {
    expect(SITE_NAME).toBeDefined();
  });

  it("expone el wordmark del sitio y el del header", () => {
    expect(SITE_NAME).toBe("Srod Almenara");
    expect(HEADER_WORDMARK).toBe("Almenara Media");
  });

  it("expone el idioma del producto", () => {
    expect(SITE_LANG).toBe("es");
  });
});
