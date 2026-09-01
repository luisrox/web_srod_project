import { describe, expect, it, vi } from "vitest";

import { projectFixtures, siteSettingsFixture } from "@/content/fixtures";

import { buildSeedDocuments, runSeed } from "./seed";

describe("seed Sanity", () => {
  it("arma documentos idénticos a los fixtures", () => {
    const docs = buildSeedDocuments();

    expect(docs.siteSettings._id).toBe("siteSettings");
    expect(docs.siteSettings.heroTitle).toBe(siteSettingsFixture.heroTitle);
    expect(docs.projects.map((project) => project.slug)).toEqual(
      projectFixtures.map((project) => project.slug),
    );
    expect(docs.kitItems.some((item) => item.id === "zoom-f6")).toBe(true);
  });

  it("rehúsa ejecutarse cuando NODE_ENV=test", async () => {
    await expect(runSeed({ createOrReplace: vi.fn() })).rejects.toThrow(
      /no corre en test/,
    );
  });
});
