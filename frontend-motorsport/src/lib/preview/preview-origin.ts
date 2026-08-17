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

export function parsePreviewAdminOrigins(value?: string | null) {
  return Array.from(
    new Set(
      (value ?? "")
        .split(",")
        .map(normalizeOrigin)
        .filter((origin): origin is string => Boolean(origin)),
    ),
  );
}

export function isAllowedPreviewRequestOrigin(
  request: Request,
  allowedOrigins: readonly string[],
) {
  if (allowedOrigins.length === 0) return true;
  const originHeader = request.headers.get("origin");
  const referer = request.headers.get("referer");
  let refererOrigin: string | null = null;
  if (referer) {
    try {
      refererOrigin = new URL(referer).origin;
    } catch {
      return false;
    }
  }
  const requestOrigin = originHeader || refererOrigin;
  return !requestOrigin || allowedOrigins.includes(requestOrigin);
}
