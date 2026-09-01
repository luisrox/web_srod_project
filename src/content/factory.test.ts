import { describe, expect, it, vi } from "vitest";

import { FallbackContentRepository } from "./fallback-repository";
import { createContentRepository } from "./factory";
import { FixtureContentRepository } from "./fixture-repository";
import { siteSettingsFixture } from "./fixtures";
import type { ContentRepository } from "./types";
import { SanityContentRepository } from "@/sanity/sanity-repository";

const validSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  ...siteSettingsFixture,
};

describe("createContentRepository", () => {
  it("sin PROJECT_ID usa el adapter de fixtures", async () => {
    const repo = createContentRepository({
      nodeEnv: "production",
      projectId: "",
    });

    expect(repo).toBeInstanceOf(FixtureContentRepository);
    await expect(repo.getSiteSettings()).resolves.toMatchObject({
      heroTitle: siteSettingsFixture.heroTitle,
    });
  });

  it("un projectId placeholder no activa Sanity", () => {
    const repo = createContentRepository({
      nodeEnv: "production",
      projectId: "placeholder",
    });

    expect(repo).toBeInstanceOf(FixtureContentRepository);
  });

  it("en NODE_ENV=test fuerza fixtures aunque haya project id", () => {
    const sanityRepo = new SanityContentRepository({
      fetch: vi.fn(),
    });
    const repo = createContentRepository({
      nodeEnv: "test",
      projectId: "abc123",
      sanityRepo,
    });

    expect(repo).toBeInstanceOf(FixtureContentRepository);
  });

  it("con env y client mock usa el adapter Sanity", async () => {
    const fetch = vi.fn().mockResolvedValue(validSettingsDoc);
    const sanityRepo = new SanityContentRepository({ fetch });
    const repo = createContentRepository({
      nodeEnv: "production",
      projectId: "abc123",
      sanityRepo,
      enableFallback: false,
    });

    expect(repo).toBeInstanceOf(SanityContentRepository);
    await expect(repo.getSiteSettings()).resolves.toMatchObject({
      heroTitle: siteSettingsFixture.heroTitle,
    });
    expect(fetch).toHaveBeenCalled();
  });
});

describe("FallbackContentRepository", () => {
  const broken: ContentRepository = {
    getSiteSettings: async () => {
      throw new Error("network");
    },
    getProjects: async () => {
      throw new Error("network");
    },
    getProjectBySlug: async () => {
      throw new Error("network");
    },
    getFeaturedProjects: async () => {
      throw new Error("network");
    },
    getKitItems: async () => {
      throw new Error("network");
    },
    getKitTeaser: async () => {
      throw new Error("network");
    },
  };

  it("si Sanity falla y el fallback está activo, usa fixtures", async () => {
    const repo = new FallbackContentRepository(
      broken,
      new FixtureContentRepository(),
      true,
    );

    await expect(repo.getSiteSettings()).resolves.toMatchObject({
      heroTitle: siteSettingsFixture.heroTitle,
    });
  });

  it("si Sanity falla y el fallback está apagado, relanza", async () => {
    const repo = new FallbackContentRepository(
      broken,
      new FixtureContentRepository(),
      false,
    );

    await expect(repo.getSiteSettings()).rejects.toThrow("network");
  });

  it("en producción el factory no envuelve fallback salvo flag", () => {
    const sanityRepo = new SanityContentRepository({ fetch: vi.fn() });
    const wrapped = createContentRepository({
      nodeEnv: "production",
      projectId: "abc123",
      sanityRepo,
    });
    const open = createContentRepository({
      nodeEnv: "development",
      projectId: "abc123",
      sanityRepo,
    });

    expect(wrapped).toBeInstanceOf(SanityContentRepository);
    expect(open).toBeInstanceOf(FallbackContentRepository);
  });
});
