import { describe, expect, it } from "vitest";

import {
  DEFAULT_ELFSIGHT_INSTAGRAM_ID,
  elfsightAppClass,
  getElfsightInstagramId,
} from "./elfsight";

describe("getElfsightInstagramId", () => {
  it("sin env usa el widget público de Srod", () => {
    expect(getElfsightInstagramId("")).toBe(DEFAULT_ELFSIGHT_INSTAGRAM_ID);
    expect(getElfsightInstagramId("  ")).toBe(DEFAULT_ELFSIGHT_INSTAGRAM_ID);
  });

  it("off desactiva el widget", () => {
    expect(getElfsightInstagramId("off")).toBeUndefined();
    expect(getElfsightInstagramId("OFF")).toBeUndefined();
  });

  it("un id explícito gana", () => {
    expect(getElfsightInstagramId("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")).toBe(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    );
  });

  it("arma la clase que espera el platform.js", () => {
    expect(elfsightAppClass(DEFAULT_ELFSIGHT_INSTAGRAM_ID)).toBe(
      `elfsight-app-${DEFAULT_ELFSIGHT_INSTAGRAM_ID}`,
    );
  });
});
