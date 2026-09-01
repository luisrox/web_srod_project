import type { KitItem, PickItem, Project, SiteSettings } from "@/domain/schemas";

export interface ContentRepository {
  getSiteSettings(): Promise<SiteSettings>;
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  getFeaturedProjects(): Promise<Project[]>;
  getKitItems(): Promise<KitItem[]>;
  getKitTeaser(): Promise<KitItem[]>;
  getPickItems(): Promise<PickItem[]>;
}
