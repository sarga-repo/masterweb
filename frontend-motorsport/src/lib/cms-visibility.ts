export type CmsVisibilitySection = {
  isActive?: boolean;
  enabled?: boolean;
};

export type CmsCanonicalSection = {
  isActive?: boolean;
};

export type CmsPageAvailabilityFlag = {
  pageEnabled?: boolean;
};

export function isCmsSectionVisible(
  section?: CmsVisibilitySection | null,
): boolean {
  return section?.isActive !== false && section?.enabled !== false;
}

/**
 * Canonical section visibility is intentionally independent of legacy
 * migration fields. A missing canonical component keeps the public section
 * available for safe frontend fallbacks, while only the canonical component
 * can explicitly hide it.
 */
export function isCmsCanonicalSectionVisible(
  canonical?: CmsCanonicalSection | null,
): boolean {
  return canonical?.isActive !== false;
}

export function isCmsPageVisible(
  availability?: CmsPageAvailabilityFlag | null,
): boolean {
  return availability?.pageEnabled !== false;
}
