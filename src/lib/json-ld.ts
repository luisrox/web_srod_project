import type { Project, SiteSettings } from "@/domain/schemas";

import { SITE_NAME } from "./site";
import { absoluteUrl, getSiteUrl } from "./site-url";

export function personJsonLd(
  settings: Pick<SiteSettings, "youtubeUrl" | "instagramUrl" | "extraSocials">,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    jobTitle: "Director de fotografía",
    url: getSiteUrl(),
    sameAs: [
      settings.youtubeUrl,
      settings.instagramUrl,
      ...(settings.extraSocials ?? []).map((social) => social.url),
    ],
  };
}

export function creativeWorkJsonLd(project: Project) {
  const still = project.stills[0];

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    dateCreated: String(project.year),
    image: still ? absoluteUrl(still.src) : undefined,
    video: `https://www.youtube.com/watch?v=${project.youtubeVideoId}`,
    creator: {
      "@type": "Person",
      name: SITE_NAME,
    },
  };
}
