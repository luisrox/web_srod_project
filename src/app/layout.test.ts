import { describe, expect, it, vi } from "vitest";

import { SITE_NAME } from "@/lib/site";

// next/font sólo existe bajo el compilador de Next; en Vitest se sustituye por
// los objetos que devuelve el loader (className + variable).
vi.mock("next/script", () => ({
  default: () => null,
}));

vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter", variable: "font-srod-body" }),
  Space_Grotesk: () => ({
    className: "space-grotesk",
    variable: "font-srod-display",
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: unknown }) => children,
}));

const { metadata } = await import("./layout");
const { fontVariables } = await import("@/styles/fonts");
const { getSiteUrl } = await import("@/lib/site-url");
const { OG_LOCALE } = await import("@/lib/og");

describe("layout raíz", () => {
  it("declara el title provisional con el wordmark y metadataBase absoluta", () => {
    expect(metadata.title).toBe(SITE_NAME);
    expect(metadata.metadataBase).toEqual(new URL(getSiteUrl()));
    expect(metadata.openGraph?.locale).toBe(OG_LOCALE);
  });

  it("expone las variables de fuente que consumen los tokens", () => {
    expect(fontVariables).toContain("font-srod-display");
    expect(fontVariables).toContain("font-srod-body");
  });
});
