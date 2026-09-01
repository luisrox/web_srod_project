import type { Metadata } from "next";

import { KitList } from "@/components/kit/KitList";
import { PageShell } from "@/components/PageShell";
import { content } from "@/content";
import { pageTitle } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = {
  title: pageTitle("Kit"),
  description:
    "El equipo que usa Srod Almenara, con la nota de para qué, no un catálogo de fabricante.",
};

export default async function KitPage() {
  const items = await content.getKitItems();

  return (
    <PageShell title="Kit">
      <p className="max-w-prose text-muted">
        Piezas de equipo con el porqué. No es un spec sheet: es cómo se resuelve
        el set.
      </p>
      <KitList items={items} />
    </PageShell>
  );
}
