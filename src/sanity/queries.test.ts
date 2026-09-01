import { describe, expect, it } from "vitest";

import {
  KIT_ITEMS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";

describe("queries GROQ", () => {
  it("pide siteSettings, project y kitItem por _type", () => {
    expect(SITE_SETTINGS_QUERY).toContain('*[_type == "siteSettings"');
    expect(PROJECTS_QUERY).toContain('*[_type == "project"]');
    expect(PROJECT_BY_SLUG_QUERY).toContain('*[_type == "project"');
    expect(PROJECT_BY_SLUG_QUERY).toContain("$slug");
    expect(KIT_ITEMS_QUERY).toContain('*[_type == "kitItem"]');
  });
});
