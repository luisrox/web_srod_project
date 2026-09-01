import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/work/CaseStudy";
import { JsonLd } from "@/components/JsonLd";
import { content } from "@/content";
import { creativeWorkJsonLd } from "@/lib/json-ld";
import { pageTitle } from "@/lib/metadata";
import { socialShareImages } from "@/lib/og";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

async function loadProject(slug: string) {
  const project = await content.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return project;
}

export async function generateStaticParams() {
  const projects = await content.getProjects();

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await content.getProjectBySlug(slug);

  if (!project) {
    return { title: pageTitle("Página no encontrada") };
  }

  const still = project.stills[0];

  return {
    title: pageTitle(project.title),
    description: project.summary,
    ...(still ? socialShareImages(still.src, still.alt) : {}),
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project.stills[0]) {
    notFound();
  }

  return (
    <>
      <JsonLd data={creativeWorkJsonLd(project)} />
      <CaseStudy project={project} />
    </>
  );
}
