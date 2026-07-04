import "server-only";

import type {
  RawSeo,
  RawStrapiMedia,
  Seo,
  StrapiImage,
} from "@/lib/strapi/types";

/**
 * Server-only Strapi client.
 *
 * `import "server-only"` guarantees this module (and the STRAPI_API_TOKEN it
 * reads) can never be pulled into a client bundle. The token is read from a
 * non-public env var, so it is never shipped to the browser.
 */

/** Server-side base URL used for content fetching (docker: http://strapi:1337). */
function contentBaseUrl(): string {
  return (
    process.env.STRAPI_API_URL ??
    process.env.STRAPI_API_URL_INTERNAL ??
    process.env.NEXT_PUBLIC_STRAPI_API_URL ??
    "http://localhost:1337"
  );
}

/** Browser-reachable base URL used to build absolute media URLs. */
function mediaBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_STRAPI_API_URL ??
    process.env.STRAPI_API_URL ??
    "http://localhost:1337"
  );
}

/** True when a Strapi API URL is configured; otherwise callers fall back to mock data. */
export function isStrapiConfigured(): boolean {
  return Boolean(
    process.env.STRAPI_API_URL ??
    process.env.STRAPI_API_URL_INTERNAL ??
    process.env.NEXT_PUBLIC_STRAPI_API_URL,
  );
}

const DEFAULT_REVALIDATE = 60;

type StrapiFetchOptions = {
  /** ISR revalidation window in seconds. */
  revalidate?: number;
  /** Extra query string (already URL-encoded), appended after `?`. */
  query?: string;
};

/**
 * Fetch JSON from Strapi. Returns `null` on any failure (network error, missing
 * config, non-2xx) so services can fall back to mock data instead of throwing.
 */
export async function strapiFetch<T>(
  path: string,
  options: StrapiFetchOptions = {},
): Promise<T | null> {
  if (!isStrapiConfigured()) return null;

  const base = contentBaseUrl().replace(/\/$/, "");
  const suffix = options.query ? `?${options.query}` : "";
  const url = `${base}/api/${path.replace(/^\//, "")}${suffix}`;

  const token = process.env.STRAPI_API_TOKEN;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: options.revalidate ?? DEFAULT_REVALIDATE },
    });

    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[strapi] ${res.status} ${res.statusText} for ${path}`);
      }
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[strapi] request failed for ${path}:`, error);
    }
    return null;
  }
}

export type StrapiMutationResult = {
  ok: boolean;
  status?: number;
  error?: string;
};

/**
 * POST JSON to a Strapi collection (server-side only). Used for form/newsletter
 * submissions in later phases. Returns a structured result instead of throwing.
 */
export async function strapiPost(
  path: string,
  data: Record<string, unknown>,
): Promise<StrapiMutationResult> {
  if (!isStrapiConfigured()) {
    return { ok: false, error: "Strapi is not configured." };
  }

  const base = contentBaseUrl().replace(/\/$/, "");
  const url = `${base}/api/${path.replace(/^\//, "")}`;

  const token = process.env.STRAPI_API_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ data }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, status: res.status, error: res.statusText };
    }
    return { ok: true, status: res.status };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

/** Convert a relative Strapi media URL into an absolute, browser-reachable URL. */
export function absoluteMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${mediaBaseUrl().replace(/\/$/, "")}${url}`;
}

/** Map a raw Strapi media object into the UI `StrapiImage` view model. */
export function mapMedia(
  media: RawStrapiMedia | undefined,
  fallbackAlt = "",
): StrapiImage | undefined {
  if (!media?.url) return undefined;
  const url = absoluteMediaUrl(media.url);
  if (!url) return undefined;
  return {
    url,
    alt: media.alternativeText ?? fallbackAlt,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  };
}

/** Map a raw Strapi SEO component into the UI `Seo` view model. */
export function mapSeo(seo: RawSeo | undefined): Seo | undefined {
  if (!seo) return undefined;
  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImageUrl: absoluteMediaUrl(seo.ogImage?.url),
    canonicalUrl: seo.canonicalUrl,
    noIndex: seo.noIndex,
  };
}
