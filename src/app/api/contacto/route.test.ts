import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { siteSettingsSchema } from "@/domain/schemas";
import { siteSettingsFixture } from "@/content/fixtures";
import { CONTACT_RATE_LIMIT_MAX } from "@/lib/rate-limit";

const verifyTurnstile = vi.fn();
const sendContactEmail = vi.fn();
const getSiteSettings = vi.fn();

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstile: (...args: unknown[]) => verifyTurnstile(...args),
}));

vi.mock("@/lib/mail", () => ({
  sendContactEmail: (...args: unknown[]) => sendContactEmail(...args),
}));

vi.mock("@/content", () => ({
  content: {
    getSiteSettings: () => getSiteSettings(),
  },
}));

const { POST } = await import("./route");
const { resetContactRateLimit } = await import("@/lib/rate-limit");

const validBody = {
  nombre: "Ada",
  email: "ada@example.com",
  organizacion: "Casa Textil",
  tipoProyecto: "Lookbook",
  fechas: "octubre",
  mensaje: "Hay un brief.",
  empresa_url: "",
  turnstileToken: "tok_ok",
};

const settings = siteSettingsSchema.parse(siteSettingsFixture);

function post(body: unknown, ip = "203.0.113.10") {
  return POST(
    new Request("http://localhost/api/contacto", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/contacto", () => {
  beforeEach(() => {
    resetContactRateLimit();
    verifyTurnstile.mockReset();
    sendContactEmail.mockReset();
    getSiteSettings.mockReset();
    verifyTurnstile.mockResolvedValue(true);
    sendContactEmail.mockResolvedValue(undefined);
    getSiteSettings.mockResolvedValue(settings);
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM", "lab@srodalmenara.com");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts_secret");
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("body inválido responde 400 y no llama a Resend", async () => {
    const badEmail = await post({ ...validBody, email: "no-email" });
    expect(badEmail.status).toBe(400);
    await expect(badEmail.json()).resolves.toMatchObject({ ok: false });

    const emptyMessage = await post({ ...validBody, mensaje: "" });
    expect(emptyMessage.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("honeypot con valor responde 200 silencioso y no llama a Resend", async () => {
    const response = await post({
      ...validBody,
      empresa_url: "https://spam.test",
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });

  it("Turnstile ausente o rechazado no llama a Resend", async () => {
    const missing = await post({ ...validBody, turnstileToken: "" });
    expect(missing.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();

    verifyTurnstile.mockResolvedValueOnce(false);
    const rejected = await post(validBody, "203.0.113.11");
    expect(rejected.status).toBe(403);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("payload válido envía a Srod con replyTo, cuerpo y CC", async () => {
    getSiteSettings.mockResolvedValue({
      ...settings,
      formCcEmail: "luis@example.com",
    });

    const response = await post(validBody);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendContactEmail).toHaveBeenCalledOnce();
    expect(sendContactEmail).toHaveBeenCalledWith({
      to: settings.contactEmail,
      from: "lab@srodalmenara.com",
      replyTo: validBody.email,
      cc: "luis@example.com",
      fields: {
        nombre: validBody.nombre,
        email: validBody.email,
        organizacion: validBody.organizacion,
        tipoProyecto: validBody.tipoProyecto,
        fechas: validBody.fechas,
        mensaje: validBody.mensaje,
      },
    });
  });

  it("si Resend falla responde 500 genérico", async () => {
    sendContactEmail.mockRejectedValueOnce(new Error("provider exploded"));

    const response = await post(validBody);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      ok: false,
      error: "No se pudo enviar. Usa el email de respaldo.",
    });
    expect(JSON.stringify(body)).not.toContain("provider exploded");
  });

  it("en desarrollo sin claves responde 503 y no llama a Resend", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "development");

    const response = await post(validBody);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("el exceso por IP responde 429", async () => {
    for (let i = 0; i < CONTACT_RATE_LIMIT_MAX; i += 1) {
      const allowed = await post({ email: "bad" }, "198.51.100.8");
      expect(allowed.status).toBe(400);
    }

    const blocked = await post(validBody, "198.51.100.8");
    expect(blocked.status).toBe(429);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
});
