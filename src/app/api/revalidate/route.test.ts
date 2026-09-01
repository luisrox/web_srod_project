import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const { POST } = await import("./route");

function post(secret?: string, header?: string) {
  const url = new URL("http://localhost/api/revalidate");
  if (secret) {
    url.searchParams.set("secret", secret);
  }
  const headers = new Headers();
  if (header) {
    headers.set("x-revalidate-secret", header);
  }
  return POST(
    new Request(url, {
      method: "POST",
      headers,
    }),
  );
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "hook-secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sin secret responde 401", async () => {
    const response = await post();

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("con secret responde 200 y revalida el layout", async () => {
    const response = await post("hook-secret");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      revalidated: true,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
