interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
}: SectionTitleProps) {
  return (
    <div
      className={
        center
          ? "text-center max-w-3xl mx-auto"
          : ""
      }
    >
      {eyebrow && (
        <span className="uppercase tracking-[0.35em] text-sm text-[#C6A664]">
          {eyebrow}
        </span>
      )}

      <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-[var(--font-playfair)] leading-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-[#666666] text-lg">
          {description}
        </p>
      )}
    </div>
  );
}