import { describe, expect, it } from "vitest";

import { SITE_NAME } from "@/lib/site";

import { metadata } from "./layout";

describe("layout raíz", () => {
  it("declara el title provisional con el wordmark", () => {
    expect(metadata.title).toBe(SITE_NAME);
  });
});
