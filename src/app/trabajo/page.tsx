import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";
import { WorkIndex } from "@/components/work/WorkIndex";
import { content } from "@/content";
import { pageTitle } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = {
  title: pageTitle("Trabajo"),
  description:
    "Índice de case studies de dirección de fotografía: piezas profundas, no un grid de thumbs.",
};

export default async function TrabajoPage() {
  const projects = await content.getProjects();

  return (
    <PageShell title="Trabajo">
      <p className="max-w-prose text-muted">
        Case studies de dirección de fotografía. Cada pieza se lee en profundidad;
        no es un muro de miniaturas.
      </p>
      <WorkIndex projects={projects} />
    </PageShell>
  );
}
