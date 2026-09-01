"use client";

import { useId, useState } from "react";

import type { Project } from "@/domain/schemas";

import {
  hasGeekFields,
  techSheetExtraBlocks,
  techSheetRows,
} from "./techSheet";

type TechSheetToggleProps = {
  project: Project;
};

export function TechSheetToggle({ project }: TechSheetToggleProps) {
  const [open, setOpen] = useState(false);
  const buttonId = useId();
  const panelId = useId();

  if (!hasGeekFields(project)) {
    return null;
  }

  const rows = techSheetRows(project);
  const extras = techSheetExtraBlocks(project);

  return (
    <div className="border-t border-line pt-8">
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline"
        onClick={() => setOpen((value) => !value)}
      >
        Ficha técnica
      </button>
      <div
        id={panelId}
        data-ui="case-geek"
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="mt-6"
      >
        {rows.length > 0 ? (
          <dl className="space-y-4">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-sm font-medium">{row.label}</dt>
                <dd className="mt-1 max-w-prose text-muted">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {extras.map((block) => (
          <div key={block.title} className="mt-6">
            <h3 className="font-display text-lg font-medium tracking-tight">
              {block.title}
            </h3>
            <p className="mt-1 max-w-prose text-muted">{block.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
