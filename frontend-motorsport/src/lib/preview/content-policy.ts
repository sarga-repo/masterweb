export function resolvePreviewCollection<T>(
  data: readonly T[] | null | undefined,
  fallback: readonly T[],
  isPreview: boolean,
): T[] {
  if (isPreview) return [...(data ?? [])];
  return data && data.length > 0 ? [...data] : [...fallback];
}
