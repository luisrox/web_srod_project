import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/JsonLd";
import { content } from "@/content";
import { creativeWorkJsonLd, personJsonLd } from "@/lib/json-ld";

function parseLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.textContent ?? "") as Record<string, unknown>;
}

describe("JSON-LD", () => {
  it("Person es parseable y declara sameAs de YouTube e Instagram", async () => {
    const settings = await content.getSiteSettings();
    const { container } = render(<JsonLd data={personJsonLd(settings)} />);
    const data = parseLd(container);

    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Srod Almenara");
    expect(data.sameAs).toEqual([settings.youtubeUrl, settings.instagramUrl]);
  });

  it("CreativeWork de un case incluye nombre, año, video e imagen absoluta", async () => {
    const project = await content.getProjectBySlug("lookbook-verano-casco");
    expect(project).toBeDefined();

    const { container } = render(
      <JsonLd data={creativeWorkJsonLd(project!)} />,
    );
    const data = parseLd(container);

    expect(data["@type"]).toBe("CreativeWork");
    expect(data.name).toBe(project!.title);
    expect(data.dateCreated).toBe(String(project!.year));
    expect(String(data.image)).toMatch(/^https?:\/\//);
    expect(String(data.video)).toContain(project!.youtubeVideoId);
  });
});
