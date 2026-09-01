import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/TextLink";

type AboutExcerptProps = {
  excerpt: string;
};

export function AboutExcerpt({ excerpt }: AboutExcerptProps) {
  return (
    <Section
      title="Sobre Srod"
      ui="about-excerpt"
      className="mx-auto max-w-6xl px-6 py-section-sm"
    >
      <p className="mt-4 max-w-prose text-muted">{excerpt}</p>
      <p className="mt-4">
        <ButtonLink href="/sobre">Leer sobre Srod</ButtonLink>
      </p>
    </Section>
  );
}
