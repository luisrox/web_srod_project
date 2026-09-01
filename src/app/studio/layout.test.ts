import { describe, expect, it } from "vitest";

import { metadata } from "./layout";

describe("layout /studio", () => {
  it("marca robots noindex", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
