function normalizeOrigin(value: string) {
  try {
    const url = new URL(value.trim());
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function parsePreviewOrigins(value?: string | null) {
  return Array.from(
    new Set(
      (value ?? "")
        .split(",")
        .map(normalizeOrigin)
        .filter((origin): origin is string => Boolean(origin)),
    ),
  );
}

export function isAllowedPreviewOrigin(
  value: string | null | undefined,
  allowedOrigins: readonly string[],
) {
  const origin = value ? normalizeOrigin(value) : null;
  return Boolean(origin && allowedOrigins.includes(origin));
}
