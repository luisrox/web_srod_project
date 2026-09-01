import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";
import { pageTitle } from "@/lib/metadata";

export const metadata: Metadata = {
  title: pageTitle("Privacidad"),
  description:
    "Los datos del formulario de contacto solo se usan para responder.",
};

export default function PrivacidadPage() {
  return (
    <PageShell title="Privacidad">
      <div className="max-w-prose space-y-4 text-muted">
        <p>
          Esta página cubre el formulario de contacto de este sitio, no una
          política genérica de 40 páginas.
        </p>
        <p>
          Qué se recoge: nombre, email, organización, tipo de proyecto, fechas y
          mensaje.
        </p>
        <p>
          Para qué: los datos solo se usan para responder a tu consulta. No se
          venden ni se usan para marketing.
        </p>
        <p>
          Este formulario no instala cookies de marketing. La analítica, si está activa, es Plausible (sin cookies de marketing).
        </p>
      </div>
    </PageShell>
  );
}
