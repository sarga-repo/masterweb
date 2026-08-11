import "server-only";

import type {
  PageAvailability,
  HeroVideo,
  RawHeroVideo,
  RawPageAvailability,
  RawSeo,
  RawStrapiMedia,
  Seo,
  StrapiImage,
} from "@/lib/strapi/types";
import type { Locale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/request";

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

export type LocalizedFetchResult<T> = {
  response: T | null;
  requestedLocale: Locale;
  resolvedLocale: Locale;
  isFallback: boolean;
};

function hasStrapiData(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("data" in value)) return false;
  const data = (value as { data?: unknown }).data;
  return Array.isArray(data)
    ? data.length > 0
    : data !== null && data !== undefined;
}

function queryWithLocale(query: string | undefined, locale: Locale): string {
  return `locale=${locale}${query ? `&${query}` : ""}`;
}

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

/**
 * Fetch a complete localized Strapi response. Missing Indonesian content falls
 * back to the complete English response; fields are never merged across locales.
 */
export async function strapiFetchLocalized<T>(
  path: string,
  options: StrapiFetchOptions & { locale?: Locale } = {},
): Promise<LocalizedFetchResult<T>> {
  const requestedLocale = options.locale ?? (await getRequestLocale());
  const localizedResponse = await strapiFetch<T>(path, {
    ...options,
    query: queryWithLocale(options.query, requestedLocale),
  });

  if (requestedLocale === "en" || hasStrapiData(localizedResponse)) {
    return {
      response: localizedResponse,
      requestedLocale,
      resolvedLocale: requestedLocale,
      isFallback: false,
    };
  }

  const englishResponse = await strapiFetch<T>(path, {
    ...options,
    query: queryWithLocale(options.query, "en"),
  });

  return {
    response: englishResponse ?? localizedResponse,
    requestedLocale,
    resolvedLocale: "en",
    isFallback: true,
  };
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

function videoFormat(
  media: RawStrapiMedia | undefined,
): "mp4" | "webm" | undefined {
  const mime = media?.mime?.toLowerCase();
  const extension = media?.ext?.toLowerCase();
  const url = media?.url?.toLowerCase();
  if (mime === "video/mp4" || extension === ".mp4" || url?.endsWith(".mp4")) {
    return "mp4";
  }
  if (
    mime === "video/webm" ||
    extension === ".webm" ||
    url?.endsWith(".webm")
  ) {
    return "webm";
  }
  return undefined;
}

/** Map the optional CMS hero-video component and reject unsupported codecs. */
export function mapHeroVideo(
  video: RawHeroVideo | undefined,
  fallbackAlt = "",
): HeroVideo | undefined {
  if (!video || video.enabled === false) return undefined;

  const sources = [video.primaryVideo, video.alternateVideo].filter(
    (item): item is Exclude<RawStrapiMedia, null> => Boolean(item?.url),
  );
  const mapped: HeroVideo = {
    posterImage: mapMedia(video.posterImage, fallbackAlt),
    mobilePosterImage: mapMedia(video.mobilePosterImage, fallbackAlt),
  };

  for (const source of sources) {
    const format = videoFormat(source);
    const url = absoluteMediaUrl(source.url);
    if (format && url && !mapped[format]) mapped[format] = url;
  }

  return mapped.mp4 || mapped.webm ? mapped : undefined;
}

/** Map the shared CMS page toggle and Coming Soon copy into a stable view model. */
export function mapPageAvailability(
  availability: RawPageAvailability | undefined,
  fallbackTitle?: string,
): PageAvailability | undefined {
  if (!availability) return undefined;
  return {
    pageEnabled: availability.pageEnabled ?? false,
    comingSoonEyebrow: availability.comingSoonEyebrow,
    comingSoonTitle: availability.comingSoonTitle ?? fallbackTitle,
    comingSoonDescription: availability.comingSoonDescription,
    comingSoonMedia: mapMedia(
      availability.comingSoonMedia,
      availability.comingSoonTitle ?? fallbackTitle ?? "Coming soon",
    ),
    launchTargetLabel: availability.launchTargetLabel,
    showNotifyCta: availability.showNotifyCta ?? true,
    noIndexWhileDisabled: availability.noIndexWhileDisabled ?? true,
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
