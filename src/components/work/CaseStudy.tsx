import Image from "next/image";

import { GalleryBox } from "@/components/GalleryBox";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { TechSheetToggle } from "@/components/work/TechSheetToggle";
import type { Project } from "@/domain/schemas";

type CaseStudyProps = {
  project: Project;
};

export function CaseStudy({ project }: CaseStudyProps) {
  const poster = project.stills[0];

  return (
    <div data-ui="case-client">
      <PageShell title={project.title}>
        <p className="text-muted">
          {project.client} · {project.role} · {project.year}
        </p>

        {poster ? (
          <Section title="Video">
            <GalleryBox className="mt-4 overflow-hidden">
              <YouTubeEmbed
                videoId={project.youtubeVideoId}
                title={project.title}
                posterSrc={poster.src}
                posterWidth={1600}
                posterHeight={900}
              />
            </GalleryBox>
          </Section>
        ) : null}

        <Section title="Galería">
          <ul
            data-ui="case-stills"
            className="mt-4 grid list-none gap-6 p-0"
          >
            {project.stills.map((still) => (
              <li key={still.src}>
                <GalleryBox as="figure" className="overflow-hidden">
                  <Image
                    src={still.src}
                    alt={still.alt}
                    width={1600}
                    height={900}
                    className="w-full object-cover"
                  />
                </GalleryBox>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Contexto">
          <p className="mt-4 max-w-prose text-muted">{project.summary}</p>
        </Section>

        <TechSheetToggle project={project} />

        <p className="max-w-prose">
          Si hay un encargo en esta línea,{" "}
          <TextLink href="/contacto">escríbeme</TextLink>.
        </p>
        <p>
          <TextLink href="/trabajo">Volver a trabajo</TextLink>
        </p>
      </PageShell>
    </div>
  );
}
