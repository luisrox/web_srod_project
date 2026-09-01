import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_SITE_URL, absoluteUrl, getSiteUrl } from "./site-url";

describe("getSiteUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
  });

  it("usa NEXT_PUBLIC_SITE_URL si está", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://preview.example/";
    expect(getSiteUrl()).toBe("https://preview.example");
  });

  it("cae a VERCEL_URL de preview y luego al dominio de lanzamiento", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = "lab-git-main.vercel.app";
    expect(getSiteUrl()).toBe("https://lab-git-main.vercel.app");

    delete process.env.VERCEL_URL;
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });
});

describe("absoluteUrl", () => {
  it("resuelve rutas relativas contra la base", () => {
    expect(absoluteUrl("/trabajo", "https://www.srodalmenara.com")).toBe(
      "https://www.srodalmenara.com/trabajo",
    );
  });
});
