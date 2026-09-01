import { afterEach, describe, expect, it, vi } from "vitest";

import {
  fadeVariants,
  parallaxOffset,
  prefersReducedMotion,
} from "./motion";

function stubMatchMedia(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe("motion / reduced-motion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("con matchMedia reduce, las variants son duration 0 u opacity-only", () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);

    const variants = fadeVariants(true);
    expect(variants.transition.duration).toBe(0);
    expect(variants.initial).toEqual({ opacity: 1 });
    expect(variants.animate).toEqual({ opacity: 1 });
    expect(parallaxOffset(true, 400)).toBe(0);
  });

  it("sin reduce hay fade y parallax", () => {
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);

    const variants = fadeVariants(false);
    expect(variants.transition.duration).toBeGreaterThan(0);
    expect(variants.initial).toEqual({ opacity: 0 });
    expect(parallaxOffset(false, 100, 0.1)).toBe(10);
  });
});
