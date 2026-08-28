import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { color, font, radius, shadow, space, tokens } from "./tokens";

const tokensCss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "tokens.css"),
  "utf8",
);

function channelLuminance(channel: number): number {
  const ratio = channel / 255;

  return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const digits = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((offset) =>
    channelLuminance(Number.parseInt(digits.slice(offset, offset + 2), 16)),
  );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (first, second) => second - first,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

function cssVarName(group: string, key: string): string {
  const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  return `--srod-${group}-${kebabKey}`;
}

describe("tokens de color", () => {
  it("expone los roles de color del sistema", () => {
    expect(Object.keys(color)).toEqual(
      expect.arrayContaining([
        "bg",
        "surface",
        "ink",
        "muted",
        "accent",
        "accentInk",
      ]),
    );

    for (const value of Object.values(color)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("pinta sobre un lienzo luminoso, nunca sobre un dark canvas", () => {
    // SPEC §3 pide look claro / galería: el fondo es papel, no set de noche.
    // Una luminancia relativa > 0.8 sólo la alcanzan fondos casi blancos;
    // un dark canvas (< 0.2) rompe este test de forma inmediata.
    expect(relativeLuminance(color.bg)).toBeGreaterThan(0.8);
    expect(relativeLuminance(color.surface)).toBeGreaterThanOrEqual(
      relativeLuminance(color.bg),
    );
  });

  it("mantiene contraste legible sobre la UI clara", () => {
    expect(contrastRatio(color.ink, color.bg)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(color.muted, color.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(color.accentInk, color.accent)).toBeGreaterThanOrEqual(
      4.5,
    );
    // El acento también es el anillo de foco: mínimo 3:1 contra el fondo.
    expect(contrastRatio(color.accent, color.bg)).toBeGreaterThanOrEqual(3);
  });
});

describe("tokens de tipografía, forma y espacio", () => {
  it("define un display y un body enlazados a next/font", () => {
    expect(font.display).toContain("var(--font-srod-display)");
    expect(font.body).toContain("var(--font-srod-body)");
  });

  it("define la forma de la caja de galería", () => {
    expect(radius.gallery).toMatch(/rem$/);
    expect(shadow.gallery).toContain("rgba");
  });

  it("define el ritmo vertical de sección", () => {
    expect(space.section).toContain("clamp(");
    expect(space.sectionSm).toContain("clamp(");
  });
});

describe("paridad TS ↔ CSS", () => {
  it("tokens.css declara exactamente las variables de tokens.ts", () => {
    for (const [group, values] of Object.entries(tokens)) {
      for (const [key, value] of Object.entries(values)) {
        expect(tokensCss).toContain(`${cssVarName(group, key)}: ${value};`);
      }
    }
  });
});
