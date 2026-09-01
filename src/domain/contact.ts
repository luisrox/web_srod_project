import { z } from "zod";

const text = z.string().trim().default("");

export const contactFieldsSchema = z.object({
  nombre: z.string().trim().min(1),
  email: z.email(),
  organizacion: text,
  tipoProyecto: text,
  fechas: text,
  mensaje: z.string().trim().min(1),
  turnstileToken: z.string().trim().min(1),
});

export type ContactFields = z.infer<typeof contactFieldsSchema>;

export function isHoneypotFilled(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") {
    return false;
  }
  const value = (raw as { empresa_url?: unknown }).empresa_url;
  return typeof value === "string" && value.trim().length > 0;
}
