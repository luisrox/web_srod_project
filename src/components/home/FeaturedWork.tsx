import Image from "next/image";

import { GalleryBox } from "@/components/GalleryBox";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import type { Project } from "@/domain/schemas";

type FeaturedWorkProps = {
  projects: Project[];
};

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  return (
    <Section
      title="Trabajo destacado"
      ui="featured-work"
      className="mx-auto max-w-4xl px-6 py-section"
    >
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const still = project.stills[0];

          return (
            <li key={project.slug}>
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
                <div className="px-6 py-5">
                  <h3 className="font-display text-lg font-medium tracking-tight">
                    <TextLink href={`/trabajo/${project.slug}`}>
                      {project.title}
                    </TextLink>
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.client} · {project.year}
                  </p>
                </div>
              </GalleryBox>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
