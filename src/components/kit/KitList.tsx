import Image from "next/image";
import type { ReactNode } from "react";

import { GalleryBox } from "@/components/GalleryBox";
import type { KitItem } from "@/domain/schemas";

type KitListProps = {
  items: KitItem[];
};

function byManualOrder(items: KitItem[]): KitItem[] {
  return [...items].sort(
    (a, b) => a.order - b.order || a.id.localeCompare(b.id),
  );
}

function KitCardShell({
  item,
  children,
}: {
  item: KitItem;
  children: ReactNode;
}) {
  if (!item.shopUrl) {
    return children;
  }

  return (
    <a
      href={item.shopUrl}
      rel="noopener noreferrer"
      target="_blank"
      className="block transition-opacity hover:opacity-90"
    >
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}

export function KitList({ items }: KitListProps) {
  const ordered = byManualOrder(items);

  return (
    <ul data-ui="kit-list" className="space-y-10">
      {ordered.map((item) => (
        <li key={item.id} data-id={item.id} data-ui="kit-item">
          <KitCardShell item={item}>
            <GalleryBox className="overflow-hidden">
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt=""
                  width={1200}
                  height={800}
                  className="w-full object-cover"
                />
              ) : null}
              <div className="px-8 py-6">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {item.name}
                </h2>
                <p className="mt-2 max-w-prose text-muted">{item.usageNote}</p>
              </div>
            </GalleryBox>
          </KitCardShell>
        </li>
      ))}
    </ul>
  );
}
