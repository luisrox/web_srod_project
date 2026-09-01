import { describe, expect, it, vi } from "vitest";

import { siteSettingsFixture } from "@/content/fixtures";

import { PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "./queries";
import { SanityContentRepository } from "./sanity-repository";

describe("SanityContentRepository", () => {
  it("usa las queries GROQ esperadas", async () => {
    const fetch = vi.fn(async (query: string) => {
      if (query === SITE_SETTINGS_QUERY) {
        return { _type: "siteSettings", ...siteSettingsFixture };
      }
      if (query === PROJECTS_QUERY) {
        return [];
      }
      return null;
    });
    const repo = new SanityContentRepository({ fetch });

    await repo.getSiteSettings();
    await repo.getProjects();

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      SITE_SETTINGS_QUERY,
      PROJECTS_QUERY,
    ]);
    expect(PROJECTS_QUERY).toContain('*[_type == "project"]');
  });

  it("getPickItems usa fixtures y no consulta GROQ", async () => {
    const fetch = vi.fn();
    const repo = new SanityContentRepository({ fetch });
    const items = await repo.getPickItems();

    expect(fetch).not.toHaveBeenCalled();
    expect(items).toHaveLength(4);
    expect(items[0]?.id).toBe("freewell-brandon-li");
  });
});
