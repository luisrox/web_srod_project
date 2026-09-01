import { afterEach, describe, expect, it, vi } from "vitest";

import { verifyTurnstile } from "./turnstile";

describe("verifyTurnstile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("devuelve true solo si siteverify responde success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      verifyTurnstile("tok", "secret", "1.1.1.1"),
    ).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(init.body)).toContain("response=tok");
    expect(String(init.body)).toContain("secret=secret");
  });

  it("devuelve false si Cloudflare rechaza el token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false }),
      }),
    );

    await expect(verifyTurnstile("bad", "secret", "1.1.1.1")).resolves.toBe(
      false,
    );
  });
});
