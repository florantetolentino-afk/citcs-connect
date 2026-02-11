import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
}

const SectionHeading = ({ badge, title, description }: SectionHeadingProps) => (
  <ScrollReveal className="mb-12 text-center">
    {badge && (
      <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-accent-foreground">
        {badge}
      </span>
    )}
    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
      {title}
    </h2>
    {description && (
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    )}
  </ScrollReveal>
);

export default SectionHeading;
