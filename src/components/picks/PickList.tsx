import Image from "next/image";

import { GalleryBox } from "@/components/GalleryBox";
import type { PickItem } from "@/domain/schemas";

type PickListProps = {
  items: PickItem[];
};

function byManualOrder(items: PickItem[]): PickItem[] {
  return [...items].sort(
    (a, b) => a.order - b.order || a.id.localeCompare(b.id),
  );
}

export function PickList({ items }: PickListProps) {
  const ordered = byManualOrder(items);

  return (
    <ul data-ui="pick-list" className="space-y-10">
      {ordered.map((item) => (
        <li key={item.id} data-id={item.id} data-ui="pick-item">
          <a
            href={item.url}
            rel="noopener noreferrer"
            target="_blank"
            className="block transition-opacity hover:opacity-90"
          >
            <GalleryBox className="overflow-hidden">
              <Image
                src={item.photo}
                alt=""
                width={1200}
                height={800}
                className="w-full object-cover"
              />
              <div className="px-8 py-6">
                <h2 className="font-display text-2xl font-medium tracking-tight">
                  {item.name}
                </h2>
                <p className="mt-2 max-w-prose text-muted">{item.note}</p>
              </div>
            </GalleryBox>
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
