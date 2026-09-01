import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { PlausibleSnippet } from "./PlausibleSnippet";

vi.mock("next/script", () => ({
  default({
    src,
    ...rest
  }: {
    src: string;
    children?: ReactNode;
    "data-domain"?: string;
  }) {
    return <span data-testid="plausible-script" data-src={src} data-domain={rest["data-domain"]} />;
  },
}));

describe("PlausibleSnippet", () => {
  it("sin dominio no inyecta script", () => {
    const { container } = render(<PlausibleSnippet domain="" />);
    expect(container.querySelector("[data-testid=plausible-script]")).toBeNull();
  });

  it("con dominio hay script oficial y data-domain", () => {
    const { container } = render(
      <PlausibleSnippet domain="srodalmenara.com" />,
    );
    const script = container.querySelector("[data-testid=plausible-script]");

    expect(script).toHaveAttribute(
      "data-src",
      "https://plausible.io/js/script.js",
    );
    expect(script).toHaveAttribute("data-domain", "srodalmenara.com");
  });
});
