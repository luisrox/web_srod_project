import type { KitItem, Project, SiteSettings } from "@/domain/schemas";

import type { ContentRepository } from "./types";

export class FallbackContentRepository implements ContentRepository {
  constructor(
    private readonly primary: ContentRepository,
    private readonly fallback: ContentRepository,
    private readonly enabled: boolean,
  ) {}

  private async withFallback<T>(
    run: (repo: ContentRepository) => Promise<T>,
  ): Promise<T> {
    try {
      return await run(this.primary);
    } catch (error) {
      if (!this.enabled) {
        throw error;
      }
      console.warn("[content] Sanity falló; usando fixtures");
      return run(this.fallback);
    }
  }

  getSiteSettings(): Promise<SiteSettings> {
    return this.withFallback((repo) => repo.getSiteSettings());
  }

  getProjects(): Promise<Project[]> {
    return this.withFallback((repo) => repo.getProjects());
  }

  getProjectBySlug(slug: string): Promise<Project | null> {
    return this.withFallback((repo) => repo.getProjectBySlug(slug));
  }

  getFeaturedProjects(): Promise<Project[]> {
    return this.withFallback((repo) => repo.getFeaturedProjects());
  }

  getKitItems(): Promise<KitItem[]> {
    return this.withFallback((repo) => repo.getKitItems());
  }

  getKitTeaser(): Promise<KitItem[]> {
    return this.withFallback((repo) => repo.getKitTeaser());
  }
}
