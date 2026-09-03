import { beforeEach, describe, expect, it, vi } from "vitest";

import { formatContactBody, sendContactEmail } from "./mail";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

describe("sendContactEmail", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: "msg_1" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "re_test");
  });

  it("llama al SDK con asunto en español, replyTo y todos los campos", async () => {
    const fields = {
      nombre: "Ada",
      email: "ada@example.com",
      mensaje: "Hay un brief.",
    };

    await sendContactEmail({
      to: "srod@srodalmenara.com",
      from: "lab@srodalmenara.com",
      replyTo: fields.email,
      cc: "luis@example.com",
      fields,
    });

    expect(send).toHaveBeenCalledOnce();
    const payload = send.mock.calls[0]![0] as {
      subject: string;
      text: string;
      to: string;
      replyTo: string;
      cc: string[];
    };
    expect(payload.to).toBe("srod@srodalmenara.com");
    expect(payload.replyTo).toBe("ada@example.com");
    expect(payload.cc).toEqual(["luis@example.com"]);
    expect(payload.subject).toMatch(/Consulta desde la web/);
    expect(payload.text).toBe(formatContactBody(fields));
    expect(payload.text).toContain("ada@example.com");
    expect(payload.text).toContain("Hay un brief.");
    expect(payload.text).not.toContain("Organización");
  });

  it("lanza si Resend devuelve error", async () => {
    send.mockResolvedValue({ data: null, error: { message: "boom" } });

    await expect(
      sendContactEmail({
        to: "srod@srodalmenara.com",
        from: "lab@srodalmenara.com",
        replyTo: "ada@example.com",
        fields: {
          nombre: "Ada",
          email: "ada@example.com",
          mensaje: "Hola",
        },
      }),
    ).rejects.toThrow("boom");
  });
});
