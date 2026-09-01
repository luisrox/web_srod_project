import {
  kitItemSchema,
  projectSchema,
  siteSettingsSchema,
  type KitItem,
  type Project,
  type SiteSettings,
} from "@/domain/schemas";

import {
  kitItemFixtures,
  projectFixtures,
  siteSettingsFixture,
} from "./fixtures";
import type { ContentRepository } from "./types";

export class FixtureContentRepository implements ContentRepository {
  private readonly settings: SiteSettings;
  private readonly projects: Project[];
  private readonly kitItems: KitItem[];

  constructor() {
    this.settings = siteSettingsSchema.parse(siteSettingsFixture);
    this.projects = projectFixtures
      .map((project) => projectSchema.parse(project))
      .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
    this.kitItems = kitItemFixtures
      .map((item) => kitItemSchema.parse(item))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return this.settings;
  }

  async getProjects(): Promise<Project[]> {
    return this.projects.slice();
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    return this.projects.find((project) => project.slug === slug) ?? null;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const bySlug = new Map(
      this.projects.map((project) => [project.slug, project]),
    );

    return this.settings.featuredProjectSlugs.flatMap((slug) => {
      const project = bySlug.get(slug);
      return project ? [project] : [];
    });
  }

  async getKitItems(): Promise<KitItem[]> {
    return this.kitItems.slice();
  }

  async getKitTeaser(): Promise<KitItem[]> {
    const byId = new Map(this.kitItems.map((item) => [item.id, item]));

    return this.settings.kitTeaserIds.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    });
  }
}
