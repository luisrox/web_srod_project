import Link from "next/link";

import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell title="Página no encontrada">
      <p className="max-w-prose text-muted">
        Esa ruta no existe en el laboratorio. Vuelve al inicio o al índice de
        trabajo.
      </p>
      <p className="flex flex-wrap gap-6">
        <Link
          href="/"
          className="text-accent underline-offset-4 hover:underline"
        >
          Inicio
        </Link>
        <Link
          href="/trabajo"
          className="text-accent underline-offset-4 hover:underline"
        >
          Trabajo
        </Link>
      </p>
    </PageShell>
  );
}
