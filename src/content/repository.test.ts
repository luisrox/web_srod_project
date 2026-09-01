import { describe, expect, it } from "vitest";

import { siteSettingsFixture } from "./fixtures";
import { content } from "./index";

describe("ContentRepository (fixtures)", () => {
  it("getSiteSettings() devuelve el titular", async () => {
    const settings = await content.getSiteSettings();

    expect(settings.heroTitle).toBe(siteSettingsFixture.heroTitle);
    expect(settings.heroTitle.length).toBeGreaterThan(0);
  });

  it("getProjects() devuelve entre 3 y 8 proyectos, ordenados", async () => {
    const projects = await content.getProjects();
    const orders = projects.map((project) => project.order);

    expect(projects.length).toBeGreaterThanOrEqual(3);
    expect(projects.length).toBeLessThanOrEqual(8);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('getProjectBySlug("slug-inexistente") devuelve null', async () => {
    await expect(content.getProjectBySlug("slug-inexistente")).resolves.toBeNull();
  });

  it("getFeaturedProjects() respeta los slugs de settings y el orden", async () => {
    const settings = await content.getSiteSettings();
    const featured = await content.getFeaturedProjects();

    expect(featured.map((project) => project.slug)).toEqual(
      settings.featuredProjectSlugs,
    );
  });

  it("getKitItems() respeta el orden manual", async () => {
    const items = await content.getKitItems();
    const orders = items.map((item) => item.order);

    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("getKitTeaser() devuelve las 2–3 piezas referenciadas en settings", async () => {
    const settings = await content.getSiteSettings();
    const teaser = await content.getKitTeaser();

    expect(teaser.length).toBeGreaterThanOrEqual(2);
    expect(teaser.length).toBeLessThanOrEqual(3);
    expect(teaser.map((item) => item.id)).toEqual(settings.kitTeaserIds);
  });

  it("getPickItems() respeta el orden manual y las URLs de afiliado", async () => {
    const items = await content.getPickItems();
    const orders = items.map((item) => item.order);

    expect(items.map((item) => item.id)).toEqual([
      "freewell-brandon-li",
      "money-shot-club",
      "arc-pulse",
      "artlist",
    ]);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(items[0]?.url).toContain("freewellgear.com");
    expect(items[1]?.url).toContain("skool.com/moneyshotclub");
    expect(items[2]?.url).toContain("arc.cc");
    expect(items[3]?.url).toContain("bit.ly/ArtlistSrodMode");
  });
});
