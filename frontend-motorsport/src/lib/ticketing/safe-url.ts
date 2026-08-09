/**
 * Ticket destination safety gates. Motorsport never handles checkout itself:
 * redirects must use HTTPS, deep links need an explicit scheme allowlist, and
 * embeds need an explicit host allowlist.
 */

function csv(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function safeTicketUrl(
  value: string | undefined,
  integration: "redirect" | "deepLink" | "embed" = "redirect",
): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol === "https:") return url.toString();
    if (
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    ) {
      return url.toString();
    }
    if (integration === "deepLink") {
      const scheme = url.protocol.replace(":", "").toLowerCase();
      if (csv("TICKETING_DEEP_LINK_SCHEMES").includes(scheme)) return value;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function safeTicketEmbedUrl(
  value: string | undefined,
): string | undefined {
  const safe = safeTicketUrl(value, "embed");
  if (!safe) return undefined;

  const allowlist = csv("TICKETING_EMBED_ALLOWLIST");
  if (!allowlist.length) return undefined;
  const host = new URL(safe).hostname.toLowerCase();
  return allowlist.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`),
  )
    ? safe
    : undefined;
}
