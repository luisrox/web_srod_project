import Image from "next/image";

import { GalleryBox } from "@/components/GalleryBox";
import { TextLink } from "@/components/TextLink";
import type { Project } from "@/domain/schemas";

type WorkIndexProps = {
  projects: Project[];
};

function orderedUnique(projects: Project[]): Project[] {
  const sorted = [...projects].sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
  const seen = new Set<string>();

  return sorted.filter((project) => {
    if (seen.has(project.slug)) {
      return false;
    }
    seen.add(project.slug);
    return true;
  });
}

export function WorkIndex({ projects }: WorkIndexProps) {
  const items = orderedUnique(projects);

  return (
    <div data-ui="work-index" className="space-y-12">
      {items.map((project) => {
        const still = project.stills[0];

        return (
          <article key={project.slug} data-ui="work-index-item">
            <GalleryBox className="overflow-hidden">
              {still ? (
                <Image
                  src={still.src}
                  alt={still.alt}
                  width={1600}
                  height={900}
                  className="aspect-video w-full object-cover"
                />
              ) : null}
              <div className="px-8 py-6">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  <TextLink href={`/trabajo/${project.slug}`}>
                    {project.title}
                  </TextLink>
                </h2>
                <p className="mt-2 text-muted">{project.client}</p>
                <p className="mt-1 text-sm text-muted">
                  {project.role} · {project.year}
                </p>
              </div>
            </GalleryBox>
          </article>
        );
      })}
    </div>
  );
}
