import { describe, expect, it } from "vitest";

import { contactFieldsSchema, isHoneypotFilled } from "./contact";

describe("contactFieldsSchema", () => {
  it("rechaza email inválido y mensaje vacío", () => {
    expect(
      contactFieldsSchema.safeParse({
        nombre: "Ada",
        email: "no-es-un-email",
        mensaje: "Hay un brief.",
        turnstileToken: "tok",
      }).success,
    ).toBe(false);

    expect(
      contactFieldsSchema.safeParse({
        nombre: "Ada",
        email: "ada@example.com",
        mensaje: "   ",
        turnstileToken: "tok",
      }).success,
    ).toBe(false);
  });

  it("acepta un payload válido", () => {
    const parsed = contactFieldsSchema.parse({
      nombre: "Ada",
      email: "ada@example.com",
      organizacion: "Casa Textil",
      tipoProyecto: "Lookbook",
      fechas: "octubre",
      mensaje: "Hay un brief.",
      turnstileToken: "tok",
    });

    expect(parsed.email).toBe("ada@example.com");
    expect(parsed.organizacion).toBe("Casa Textil");
  });
});

describe("isHoneypotFilled", () => {
  it("detecta empresa_url con valor y ignora vacío", () => {
    expect(isHoneypotFilled({ empresa_url: "https://spam.test" })).toBe(true);
    expect(isHoneypotFilled({ empresa_url: "  " })).toBe(false);
    expect(isHoneypotFilled({ empresa_url: "" })).toBe(false);
    expect(isHoneypotFilled({})).toBe(false);
  });
});
