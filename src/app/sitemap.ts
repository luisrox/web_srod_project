import type { MetadataRoute } from "next";

import { content } from "@/content";
import { absoluteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await content.getProjects();

  const staticRoutes = [
    "/",
    "/recomendados",
    "/trabajo",
    "/kit",
    "/sobre",
    "/contacto",
    "/privacidad",
  ];

  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/trabajo/${project.slug}`),
    })),
  ];
}
