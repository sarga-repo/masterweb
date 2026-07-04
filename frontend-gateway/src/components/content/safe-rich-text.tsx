type SafeRichTextProps = {
  content?: string;
  fallback?: string;
  className?: string;
};

/**
 * Renders CMS rich text as escaped paragraph text. This intentionally avoids
 * `dangerouslySetInnerHTML`; structured block rendering can replace it when a
 * Strapi blocks field is introduced.
 */
export function SafeRichText({
  content,
  fallback,
  className,
}: SafeRichTextProps) {
  const value = content?.trim() || fallback?.trim();
  if (!value) return null;

  const paragraphs = value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 32)}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}
