/**
 * Minimal rich-text renderer for CMS `richtext` (markdown-ish) strings.
 * Splits on blank lines into paragraphs — enough for the seeded plain-text
 * content. A full markdown/blocks renderer can replace this later without
 * changing call sites.
 */
export function RichText({
  value,
  className = "",
}: {
  value?: string;
  className?: string;
}) {
  if (!value?.trim()) return null;

  const paragraphs = value
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-5 ${className}`.trim()}>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-base leading-8 text-hs-cream/70">
          {p}
        </p>
      ))}
    </div>
  );
}
