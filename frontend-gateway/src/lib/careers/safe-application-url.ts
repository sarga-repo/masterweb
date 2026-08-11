const LINKEDIN_HOST = "linkedin.com";

export function safeLinkedInApplicationUrl(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isLinkedIn =
      host === LINKEDIN_HOST || host.endsWith(`.${LINKEDIN_HOST}`);

    if (
      url.protocol !== "https:" ||
      !isLinkedIn ||
      url.username ||
      url.password
    ) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
