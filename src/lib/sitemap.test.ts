import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { content } from "@/content";
import { absoluteUrl } from "@/lib/site-url";

describe("sitemap", () => {
  it("incluye las rutas públicas y los slugs fixture, no studio ni presets", async () => {
    const projects = await content.getProjects();
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/recomendados"));
    expect(urls).toContain(absoluteUrl("/trabajo"));
    expect(urls).toContain(absoluteUrl("/kit"));
    expect(urls).toContain(absoluteUrl("/sobre"));
    expect(urls).toContain(absoluteUrl("/contacto"));
    expect(urls).toContain(absoluteUrl("/privacidad"));

    for (const project of projects) {
      expect(urls).toContain(absoluteUrl(`/trabajo/${project.slug}`));
    }

    expect(urls.some((url) => url.includes("/studio"))).toBe(false);
    expect(urls.some((url) => url.includes("/presets"))).toBe(false);
    expect(urls.some((url) => url.includes("/blog"))).toBe(false);
  });
});

describe("robots", () => {
  it("permite lo público, bloquea /studio y apunta al sitemap", () => {
    const file = robots();
    const rules = Array.isArray(file.rules) ? file.rules[0] : file.rules;

    expect(rules?.allow).toBe("/");
    expect(rules?.disallow).toBe("/studio");
    expect(file.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
