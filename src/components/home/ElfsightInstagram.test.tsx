import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_ELFSIGHT_INSTAGRAM_ID,
  ELFSIGHT_PLATFORM_SRC,
  elfsightAppClass,
} from "@/lib/elfsight";

import { ElfsightInstagram } from "./ElfsightInstagram";

vi.mock("next/script", () => ({
  default({ src }: { src: string; children?: ReactNode }) {
    return <span data-testid="elfsight-script" data-src={src} />;
  },
}));

describe("ElfsightInstagram", () => {
  it("monta el contenedor del widget y el platform.js", () => {
    const { container } = render(
      <ElfsightInstagram widgetId={DEFAULT_ELFSIGHT_INSTAGRAM_ID} />,
    );

    expect(
      container.querySelector(
        `.${elfsightAppClass(DEFAULT_ELFSIGHT_INSTAGRAM_ID)}`,
      ),
    ).not.toBeNull();
    expect(
      container.querySelector("[data-testid=elfsight-script]"),
    ).toHaveAttribute("data-src", ELFSIGHT_PLATFORM_SRC);
  });
});
