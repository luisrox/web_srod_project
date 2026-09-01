import type { Metadata } from "next";

import { PickList } from "@/components/picks/PickList";
import { PageShell } from "@/components/PageShell";
import { content } from "@/content";
import { pageTitle } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = {
  title: pageTitle("Recomendados"),
  description:
    "Filtros, comunidad, fundas y Artlist que Srod recomienda, con sus enlaces de afiliado.",
};

export default async function RecomendadosPage() {
  const items = await content.getPickItems();

  return (
    <PageShell title="Recomendados" width="narrow">
      <p className="max-w-prose text-muted">
        Cosas que Srod usa y recomienda. Algunos enlaces llevan descuento de
        afiliado; no es un catálogo ni el índice de cases.
      </p>
      <PickList items={items} />
    </PageShell>
  );
}
