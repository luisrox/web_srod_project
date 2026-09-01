import { Section } from "@/components/Section";

type WhereaboutsProps = {
  text: string | null;
};

export function Whereabouts({ text }: WhereaboutsProps) {
  const value = text?.trim();

  if (!value) {
    return null;
  }

  return (
    <Section
      title="Dónde encontrarme"
      ui="whereabouts"
      className="mx-auto max-w-4xl px-6 py-section"
    >
      <p className="mt-4 max-w-prose text-muted">{value}</p>
    </Section>
  );
}
