import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";

type AboutExcerptProps = {
  excerpt: string;
};

export function AboutExcerpt({ excerpt }: AboutExcerptProps) {
  return (
    <Section
      title="Sobre Srod"
      ui="about-excerpt"
      className="mx-auto max-w-4xl px-6 py-section"
    >
      <p className="mt-4 max-w-prose text-muted">{excerpt}</p>
      <p className="mt-4">
        <TextLink href="/sobre">Leer sobre Srod</TextLink>
      </p>
    </Section>
  );
}
