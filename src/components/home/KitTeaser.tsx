import Image from "next/image";

import { GalleryBox } from "@/components/GalleryBox";
import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/TextLink";
import type { KitItem } from "@/domain/schemas";

type KitTeaserProps = {
  items: KitItem[];
};

export function KitTeaser({ items }: KitTeaserProps) {
  return (
    <Section
      title="Kit"
      ui="kit-teaser"
      className="mx-auto max-w-6xl px-6 py-section-sm"
    >
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const card = (
            <GalleryBox className="h-full overflow-hidden">
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt=""
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : null}
              <div className="px-6 py-5">
                <h3 className="font-display text-lg font-medium tracking-tight">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.usageNote}</p>
              </div>
            </GalleryBox>
          );

          return (
            <li key={item.id} data-ui="kit-teaser-item">
              {item.shopUrl ? (
                <a
                  href={item.shopUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="block h-full transition-opacity hover:opacity-90"
                >
                  {card}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6">
        <ButtonLink href="/kit">Ver el kit completo</ButtonLink>
      </p>
    </Section>
  );
}
