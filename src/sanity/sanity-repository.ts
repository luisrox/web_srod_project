import { pickItemFixtures } from "@/content/fixtures";
import type { ContentRepository } from "@/content/types";
import {
  pickItemSchema,
  type KitItem,
  type PickItem,
  type Project,
  type SiteSettings,
} from "@/domain/schemas";

import type { SanityFetcher } from "./client";
import {
  mapKitItems,
  mapProject,
  mapProjects,
  mapSiteSettings,
} from "./mapper";
import {
  KIT_ITEMS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";

export class SanityContentRepository implements ContentRepository {
  constructor(private readonly client: SanityFetcher) {}

  async getSiteSettings(): Promise<SiteSettings> {
    const raw: unknown = await this.client.fetch(SITE_SETTINGS_QUERY);
    return mapSiteSettings(raw);
  }

  async getProjects(): Promise<Project[]> {
    const raw: unknown = await this.client.fetch(PROJECTS_QUERY);
    return mapProjects(raw);
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const raw: unknown = await this.client.fetch(PROJECT_BY_SLUG_QUERY, {
      slug,
    });
    if (raw == null) {
      return null;
    }
    return mapProject(raw);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const settings = await this.getSiteSettings();
    const projects = await this.getProjects();
    const bySlug = new Map(projects.map((project) => [project.slug, project]));

    return settings.featuredProjectSlugs.flatMap((slug) => {
      const project = bySlug.get(slug);
      return project ? [project] : [];
    });
  }

  async getKitItems(): Promise<KitItem[]> {
    const raw: unknown = await this.client.fetch(KIT_ITEMS_QUERY);
    return mapKitItems(raw);
  }

  async getKitTeaser(): Promise<KitItem[]> {
    const settings = await this.getSiteSettings();
    const items = await this.getKitItems();
    const byId = new Map(items.map((item) => [item.id, item]));

    return settings.kitTeaserIds.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    });
  }

  /**
   * Los picks de afiliado viven en fixtures hasta que haya tipo CMS.
   * Si Sanity no los publica, la página /recomendados sigue resolviendo.
   */
  async getPickItems(): Promise<PickItem[]> {
    return pickItemFixtures
      .map((item) => pickItemSchema.parse(item))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  }
}
