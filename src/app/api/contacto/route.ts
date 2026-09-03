import { contactFieldsSchema, isHoneypotFilled } from "@/domain/contact";
import { content } from "@/content";
import { sendContactEmail } from "@/lib/mail";
import { consumeContactRateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const GENERIC_ERROR = "No se pudo enviar. Usa el email de respaldo.";

type RawBody = Record<string, unknown>;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

async function readBody(request: Request): Promise<RawBody | null> {
  const type = request.headers.get("content-type") ?? "";

  try {
    if (type.includes("application/json")) {
      const json: unknown = await request.json();
      if (!json || typeof json !== "object") {
        return null;
      }
      const raw = json as RawBody;
      return {
        nombre: asText(raw.nombre),
        email: asText(raw.email),
        mensaje: asText(raw.mensaje),
        empresa_url: asText(raw.empresa_url),
        turnstileToken: asText(
          raw.turnstileToken ?? raw["cf-turnstile-response"],
        ),
      };
    }

    const form = await request.formData();
    return {
      nombre: String(form.get("nombre") ?? ""),
      email: String(form.get("email") ?? ""),
      mensaje: String(form.get("mensaje") ?? ""),
      empresa_url: String(form.get("empresa_url") ?? ""),
      turnstileToken: String(
        form.get("turnstileToken") ?? form.get("cf-turnstile-response") ?? "",
      ),
    };
  } catch {
    return null;
  }
}

function json(status: number, body: { ok: boolean; error?: string }) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (!consumeContactRateLimit(ip)) {
    return json(429, {
      ok: false,
      error: "Demasiados envíos. Espera un poco e inténtalo de nuevo.",
    });
  }

  const mailReady =
    Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.RESEND_FROM);

  if (!mailReady) {
    return json(503, {
      ok: false,
      error:
        "El correo no está configurado en este entorno. Añade RESEND_API_KEY y RESEND_FROM en .env.local.",
    });
  }

  const raw = await readBody(request);
  if (!raw) {
    return json(400, { ok: false, error: "Revisa los datos del formulario." });
  }

  if (isHoneypotFilled(raw)) {
    return json(200, { ok: true });
  }

  const parsed = contactFieldsSchema.safeParse(raw);
  if (!parsed.success) {
    return json(400, { ok: false, error: "Revisa los datos del formulario." });
  }

  const { turnstileToken, ...fields } = parsed.data;
  const secret = process.env.TURNSTILE_SECRET_KEY ?? "";
  if (secret) {
    if (!turnstileToken) {
      return json(400, { ok: false, error: "Confirma que no eres un robot." });
    }
    const turnstileOk = await verifyTurnstile(turnstileToken, secret, ip);
    if (!turnstileOk) {
      return json(403, {
        ok: false,
        error: "No se pudo verificar el anti-spam.",
      });
    }
  }

  const settings = await content.getSiteSettings();
  const from = process.env.RESEND_FROM;
  if (!from) {
    return json(500, { ok: false, error: GENERIC_ERROR });
  }

  const cc = settings.formCcEmail ?? process.env.FORM_CC_EMAIL;

  try {
    await sendContactEmail({
      to: settings.contactEmail,
      from,
      replyTo: fields.email,
      cc: cc || undefined,
      fields,
    });
  } catch (error) {
    console.error("[contacto] envío falló", error);
    const detail = error instanceof Error ? error.message : "";
    if (/not verified|invalid `?from`?|from address/i.test(detail)) {
      return json(500, {
        ok: false,
        error:
          "Resend rechazó el remitente. En .env.local pon RESEND_FROM=Resend <onboarding@resend.dev>. El destino de prueba tiene que ser el email de esa cuenta de Resend.",
      });
    }
    return json(500, { ok: false, error: GENERIC_ERROR });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[contacto] envío aceptado");
  }

  return json(200, { ok: true });
}
