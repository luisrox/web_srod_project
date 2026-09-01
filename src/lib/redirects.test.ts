import { describe, expect, it } from "vitest";

import { CURRENT_SHOP_URL } from "./shop";
import { redirects } from "./redirects";

describe("redirects /presets", () => {
  it("apunta a la URL documentada de la tienda, sin 308 permanente", () => {
    expect(redirects).toEqual([
      {
        source: "/presets",
        destination: CURRENT_SHOP_URL,
        permanent: false,
      },
    ]);
    expect(CURRENT_SHOP_URL).toMatch(/^https:\/\//);
  });
});
