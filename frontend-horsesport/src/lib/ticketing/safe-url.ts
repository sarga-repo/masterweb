/**
 * Ticket URL safety. Sarga never runs an internal checkout - every ticket link
 * is a partner redirect, an approved deep link, or (only when explicitly
 * allowlisted) an embed. These helpers gate each mode so a compromised or
 * mistyped CMS value can't produce a `javascript:` link or an untrusted iframe.
 */

function csv(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Return a safe destination URL, or `undefined` if it fails the mode's policy.
 *  - redirect (default): HTTPS only (localhost HTTP allowed in dev).
 *  - deepLink: also allows custom schemes in TICKETING_DEEP_LINK_SCHEMES.
 *  - embed: HTTPS only; host allowlist is enforced by safeTicketEmbedUrl.
 */
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
      const schemes = csv("TICKETING_DEEP_LINK_SCHEMES");
      if (schemes.includes(url.protocol.replace(":", "").toLowerCase())) {
        return value;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * Return a safe embed URL only when its host matches (or is a subdomain of) an
 * entry in TICKETING_EMBED_ALLOWLIST. Empty allowlist ⇒ embeds disabled.
 */
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
