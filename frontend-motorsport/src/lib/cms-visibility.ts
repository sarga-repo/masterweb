export type CmsVisibilitySection = {
  enabled?: boolean;
};

export type CmsPageAvailabilityFlag = {
  pageEnabled?: boolean;
};

export function isCmsSectionVisible(
  section?: CmsVisibilitySection | null,
): boolean {
  return section?.enabled !== false;
}

export function isCmsPageVisible(
  availability?: CmsPageAvailabilityFlag | null,
): boolean {
  return availability?.pageEnabled !== false;
}
