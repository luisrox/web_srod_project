import { GalleryBox } from "@/components/GalleryBox";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import type { KitItem } from "@/domain/schemas";

type KitTeaserProps = {
  items: KitItem[];
};

export function KitTeaser({ items }: KitTeaserProps) {
  return (
    <Section
      title="Kit"
      ui="kit-teaser"
      className="mx-auto max-w-4xl px-6 py-section"
    >
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} data-ui="kit-teaser-item">
            <GalleryBox className="h-full px-6 py-5">
              <h3 className="font-display text-lg font-medium tracking-tight">
                {item.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.usageNote}</p>
            </GalleryBox>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <TextLink href="/kit">Ver el kit</TextLink>
      </p>
    </Section>
  );
}
