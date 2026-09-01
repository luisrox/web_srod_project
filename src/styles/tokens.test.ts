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
        "onSurface",
        "onSurfaceMuted",
        "glow",
      ]),
    );

    for (const value of Object.values(color)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("el lienzo es un set de madera; las cajas siguen siendo papel", () => {
    // Fondo vivo tipo video de Srod: nogal oscuro. Las cajas de galería
    // conservan papel luminoso para stills y fichas.
    expect(relativeLuminance(color.bg)).toBeLessThan(0.2);
    expect(relativeLuminance(color.surface)).toBeGreaterThan(0.8);
  });

  it("mantiene contraste en el set y sobre el papel", () => {
    expect(contrastRatio(color.ink, color.bg)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(color.muted, color.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(color.accentInk, color.accent)).toBeGreaterThanOrEqual(
      4.5,
    );
    expect(contrastRatio(color.accent, color.bg)).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.onSurface, color.surface),
    ).toBeGreaterThanOrEqual(7);
    expect(
      contrastRatio(color.onSurfaceMuted, color.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.onSurfaceAccentInk, color.onSurfaceAccent),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(color.onSurfaceAccent, color.surface),
    ).toBeGreaterThanOrEqual(3);
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

const globalsCss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "globals.css"),
  "utf8",
);

describe("papel sobre el set", () => {
  it("globals.css remapea tinta de galería sobre .bg-surface", () => {
    expect(globalsCss).toContain(".bg-surface");
    expect(globalsCss).toContain("--srod-color-ink: var(--srod-color-on-surface)");
  });
});
