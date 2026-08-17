const SAFE_PREVIEW_PATH =
  /^\/(?:id\/)?(?:news|events)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_IJTC_CHILD_PATH =
  /^\/(?:id\/)?events\/indonesia-junior-talent-cup\/(?:about|become-riders|race-schedule|regulation|riders|standings)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/;
const SAFE_SITE_PATHS = new Set([
  "/",
  "/id",
  "/about",
  "/id/about",
  "/events",
  "/id/events",
  "/news",
  "/id/news",
  "/contact",
  "/id/contact",
  "/partners",
  "/id/partners",
  "/tickets",
  "/id/tickets",
  "/gallery",
  "/id/gallery",
  "/merchandise",
  "/id/merchandise",
  "/experience",
  "/id/experience",
]);

export function isSafePreviewPath(value: string | null): value is string {
  return Boolean(
    value &&
    (SAFE_SITE_PATHS.has(value) ||
      SAFE_PREVIEW_PATH.test(value) ||
      SAFE_IJTC_CHILD_PATH.test(value)),
  );
}

export function normalizePreviewStatus(value: string | null) {
  if (value === "modified") return "draft";
  return value === "published"
    ? "published"
    : value === "draft"
      ? "draft"
      : null;
}
