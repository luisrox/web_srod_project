import { Resend } from "resend";

import type { ContactFields } from "@/domain/contact";

export type ContactEmailInput = {
  to: string;
  from: string;
  replyTo: string;
  cc?: string;
  fields: Omit<ContactFields, "turnstileToken">;
};

export function formatContactBody(
  fields: ContactEmailInput["fields"],
): string {
  return [
    `Nombre: ${fields.nombre}`,
    `Email: ${fields.email}`,
    `Organización: ${fields.organizacion || "—"}`,
    `Tipo de proyecto: ${fields.tipoProyecto || "—"}`,
    `Fechas: ${fields.fechas || "—"}`,
    "",
    "Mensaje:",
    fields.mensaje,
  ].join("\n");
}

export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("missing_resend_key");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    cc: input.cc ? [input.cc] : undefined,
    subject: `Consulta desde la web: ${input.fields.nombre}`,
    text: formatContactBody(input.fields),
  });

  if (error) {
    throw new Error("resend_failed");
  }
}
