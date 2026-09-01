import type { ExtraBlock, Project } from "@/domain/schemas";
import { hasGeekFields } from "@/domain/schemas";

export const TECH_SHEET_FIELDS = [
  { key: "camera", label: "Cámara" },
  { key: "lenses", label: "Lentes" },
  { key: "lighting", label: "Iluminación" },
  { key: "look", label: "Look / color" },
  { key: "whyNotes", label: "Por qué" },
  { key: "codec", label: "Codec" },
  { key: "pipeline", label: "Pipeline" },
] as const satisfies ReadonlyArray<{
  key: keyof Project;
  label: string;
}>;

export type TechSheetRow = {
  label: string;
  value: string;
};

export function techSheetRows(project: Project): TechSheetRow[] {
  return TECH_SHEET_FIELDS.flatMap(({ key, label }) => {
    const value = project[key];
    if (typeof value !== "string" || value.length === 0) {
      return [];
    }
    return [{ label, value }];
  });
}

export function techSheetExtraBlocks(project: Project): ExtraBlock[] {
  return project.extraBlocks ?? [];
}

export { hasGeekFields };
