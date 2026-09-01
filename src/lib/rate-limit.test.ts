import { beforeEach, describe, expect, it } from "vitest";

import {
  consumeContactRateLimit,
  CONTACT_RATE_LIMIT_MAX,
  resetContactRateLimit,
} from "./rate-limit";

describe("consumeContactRateLimit", () => {
  beforeEach(() => {
    resetContactRateLimit();
  });

  it("rechaza el exceso por IP dentro de la ventana", () => {
    for (let i = 0; i < CONTACT_RATE_LIMIT_MAX; i += 1) {
      expect(consumeContactRateLimit("1.1.1.1")).toBe(true);
    }
    expect(consumeContactRateLimit("1.1.1.1")).toBe(false);
    expect(consumeContactRateLimit("8.8.8.8")).toBe(true);
  });
});
