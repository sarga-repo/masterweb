/**
 * Inline JSON-LD structured data. Pass a plain object (Event, NewsArticle,
 * BreadcrumbList, Organization, …). `<` is escaped so a stray value can never
 * break out of the script tag.
 */
export function SeoJsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
