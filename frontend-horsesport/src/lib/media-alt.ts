export function resolveImageAlt(
  alt: string | null | undefined,
  fallback: string,
): string {
  return alt?.trim() || fallback;
}
