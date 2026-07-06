/** Turn a URL slug into a human-readable title (e.g. "merdeka-cup" → "Merdeka Cup"). */
export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
