import "server-only";

/**
 * Lightweight Strapi REST client for the Sarga Motorsport frontend.
 *
 * Queries the shared CMS (siteScope = "motorsport" | "shared") and returns
 * typed results.  Every call is wrapped in a try/catch so the homepage always
 * renders - falling back to curated placeholder content when the API is
 * unreachable (local dev without Strapi, CI, etc.).
 */

import { strapiConfig } from "./config";
import type { Locale } from "@/lib/i18n/config";
import { draftMode } from "next/headers";
import { getRequestLocaleSafe } from "@/lib/i18n/request";
import { previewCollectionForUid } from "@/lib/preview/preview-context";
import { getMotorsportPreviewContext } from "@/lib/preview/preview-request-context";
import { cmsFetchTags } from "@/lib/cms-revalidation";
import { isExactSingleDocument } from "@/lib/motorsport-page-foundation";

/* -------------------------------------------------------------------------- */
/*  Generic helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Strapi v5 flat list-response envelope (no `attributes` wrapper). */
export type StrapiListResponse<T> = {
  data: Array<T & { id: number; documentId: string }>;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  localization?: {
    requestedLocale: Locale;
    resolvedLocale: Locale;
    isFallback: boolean;
  };
};

/** Strapi v5 flat single-response envelope. */
export type StrapiSingleResponse<T> = {
  data: (T & { id: number; documentId: string }) | null;
};

export type StrapiMediaFormat = {
  url: string;
  width: number;
  height: number;
};

export type StrapiMedia = {
  id: number;
  url: string;
  mime?: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
};

/** Build a fully-qualified media URL from a Strapi media entry. */
export function mediaUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${strapiConfig.publicApiUrl}${url}`;
}

/** Build the ?populate=… value for nested relations. */
function populateParam(populate: string | string[]): string {
  if (Array.isArray(populate)) {
    return populate
      .map((field) => {
        const [root, ...children] = field.split(".");
        const nested = children.map((child) => `[populate][${child}]`).join("");
        return `populate[${root}]${nested}=true`;
      })
      .join("&");
  }
  return `populate[${populate}]=true`;
}

/* -------------------------------------------------------------------------- */
/*  Fetch wrappers                                                            */
/* -------------------------------------------------------------------------- */

type FetchOptions = {
  populate?: string | string[];
  filters?: Record<string, string>;
  sort?: string;
  limit?: number;
  page?: number;
  start?: number;
  revalidate?: number;
  locale?: Locale;
};

type SingleFetchOptions = Pick<
  FetchOptions,
  "populate" | "revalidate" | "locale"
>;

export type StrapiFetchFailureKind =
  "unauthorized" | "forbidden" | "unavailable" | "invalid";

export type StrapiFetchResult<T> =
  | { state: "success"; response: StrapiListResponse<T> }
  | { state: "empty" }
  | { state: StrapiFetchFailureKind; status?: number };

export type StrapiSingleFetchResult<T> =
  | { state: "success"; response: StrapiSingleResponse<T> }
  | { state: "empty" }
  | { state: StrapiFetchFailureKind; status?: number };

export class StrapiPreviewFetchError extends Error {
  readonly kind: StrapiFetchFailureKind;
  readonly collection: string;

  constructor(kind: StrapiFetchFailureKind, collection: string) {
    super(`CMS preview read failed (${kind}) for ${collection}.`);
    this.name = "StrapiPreviewFetchError";
    this.kind = kind;
    this.collection = collection;
  }
}

export async function isStrapiPreviewEnabled() {
  const { isEnabled } = await draftMode();
  return isEnabled;
}

async function previewFetchOptions() {
  const isEnabled = await isStrapiPreviewEnabled();
  if (!isEnabled) return {};
  const context = await getMotorsportPreviewContext();
  // Draft Mode can outlive the signed Motorsport preview cookie (for example
  // after an expired preview or a browser restart). Without a verifiable
  // target, this is not an authorized draft request: read the public CMS
  // content instead of sending `status=draft` and making every collection
  // appear invalid to the published route.
  return context
    ? { status: context.status, cache: "no-store" as const, context }
    : {};
}

function buildQs(opts: FetchOptions): string {
  const params = new URLSearchParams();
  if (opts.populate) {
    const populateStr = populateParam(opts.populate);
    // Append populate parameters (may contain multiple &populate[...]=true)
    populateStr.split("&").forEach((p) => {
      const [key, value] = p.split("=");
      params.append(key, value);
    });
  }
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.limit != null)
    params.set("pagination[pageSize]", String(opts.limit));
  if (opts.page != null) params.set("pagination[page]", String(opts.page));
  if (opts.start != null) params.set("pagination[start]", String(opts.start));
  if (opts.filters) {
    for (const [key, value] of Object.entries(opts.filters)) {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetch a list of entries from a Strapi collection.
 * Returns `null` when the API is unreachable so callers can fall back
 * gracefully.
 */
export async function fetchStrapiListResult<T>(
  collection: string,
  opts: FetchOptions = {},
): Promise<StrapiFetchResult<T>> {
  const preview = await previewFetchOptions();
  if (preview.status && !preview.context) return { state: "invalid" };
  const exactCollection = preview.context
    ? previewCollectionForUid(preview.context.uid)
    : null;
  const requestedLocale =
    opts.locale ?? (await getRequestLocaleSafe());
  const isExactPreviewRequest = Boolean(
    preview.status &&
      exactCollection === collection &&
      preview.context?.locale === requestedLocale,
  );
  if (isExactPreviewRequest && !strapiConfig.apiToken) {
    return { state: "unauthorized" };
  }
  const requestOptions: FetchOptions = isExactPreviewRequest
    ? {
        ...opts,
        filters: {
          ...(opts.filters ?? {}),
          "filters[documentId][$eq]": preview.context!.documentId,
        },
      }
    : opts;
  const requestLocale = async (locale: Locale) => {
    const separator = buildQs(requestOptions) ? "&" : "?";
    const params = new URLSearchParams(
      `${buildQs(requestOptions)}${separator}locale=${locale}`.replace(
        /^\?/,
        "",
      ),
    );
    if (isExactPreviewRequest) params.set("status", preview.status!);
    const url = `${strapiConfig.apiUrl}/api/${collection}?${params}`;
    const documentId = requestOptions.filters?.["filters[documentId][$eq]"];
    const fetchWithAuth = async (useToken: boolean) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4_000);
      try {
        return await fetch(url, {
          signal: controller.signal,
          next:
            preview.cache === "no-store"
              ? undefined
              : {
                  revalidate: opts.revalidate ?? 60,
                  tags: cmsFetchTags(collection, locale, documentId),
                },
          cache: preview.cache,
          headers:
            useToken && strapiConfig.apiToken
              ? { Authorization: `Bearer ${strapiConfig.apiToken}` }
              : undefined,
        });
      } finally {
        clearTimeout(timeout);
      }
    };

    let res = await fetchWithAuth(Boolean(strapiConfig.apiToken));
    // A stale local token should not make public CMS content disappear. Retry
    // without credentials outside preview so Strapi's public permissions remain
    // authoritative. Draft reads must never fall back to an unauthenticated
    // request.
    if (
      (res.status === 401 || res.status === 403) &&
      strapiConfig.apiToken &&
      !isExactPreviewRequest
    ) {
      res = await fetchWithAuth(false);
    }
    if (res.status === 401) {
      return { state: "unauthorized", status: res.status } as const;
    }
    if (res.status === 403) {
      return { state: "forbidden", status: res.status } as const;
    }
    if (!res.ok) {
      return { state: "unavailable", status: res.status } as const;
    }
    try {
      const response = (await res.json()) as StrapiListResponse<T>;
      return response.data.length === 0
        ? isExactPreviewRequest
          ? ({ state: "invalid" } as const)
          : ({ state: "empty" } as const)
        : ({ state: "success", response } as const);
    } catch {
      return { state: "invalid", status: res.status } as const;
    }
  };
  try {
    let result = await requestLocale(requestedLocale);
    let resolvedLocale = requestedLocale;
    if (
      !preview.status &&
      requestedLocale === "id" &&
      result.state === "empty"
    ) {
      result = await requestLocale("en");
      resolvedLocale = "en";
    }
    return result.state === "success"
      ? {
          state: "success",
          response: {
            ...result.response,
            localization: {
              requestedLocale,
              resolvedLocale,
              isFallback: requestedLocale !== resolvedLocale,
            },
          },
        }
      : result;
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("[motorsport-cms] CMS request unavailable", {
        collection,
        preview: Boolean(preview.status),
        reason: error instanceof Error ? error.name : "unknown",
      });
    }
    return { state: "unavailable" };
  }
}

/**
 * Backwards-compatible collection reader. Published rendering may use curated
 * fallbacks when Strapi is unavailable. Preview fails closed so editors never
 * mistake fallback content for their saved draft.
 */
export async function fetchStrapiList<T>(
  collection: string,
  opts: FetchOptions = {},
): Promise<StrapiListResponse<T> | null> {
  const result = await fetchStrapiListResult<T>(collection, opts);
  if (result.state === "success") return result.response;
  if (result.state === "empty") return null;

  const preview = await previewFetchOptions();
  const isPreviewTarget = Boolean(
    preview.context && previewCollectionForUid(preview.context.uid) === collection,
  );
  // A stale/expired Draft Mode cookie can leave Next.js in draft mode without
  // a verifiable Motorsport preview context. Treat that state as a normal
  // published read so a broken preview session never takes the live site down.
  // Exact, signed preview targets still fail closed below when their document
  // cannot be read or validated.
  if (preview.status && preview.context && isPreviewTarget) {
    throw new StrapiPreviewFetchError(result.state, collection);
  }

  if (process.env.NODE_ENV !== "test") {
    console.warn("[motorsport-cms] Published CMS read fell back", {
      collection,
      state: result.state,
      status: result.status,
    });
  }
  return null;
}

/**
 * Fetch a Strapi Single Type while preserving the same Preview/live contract
 * as collection reads. The response documentId is checked against the exact
 * signed Preview context so a stale or mismatched Single Type cannot render.
 */
export async function fetchStrapiSingleResult<T>(
  collection: string,
  opts: SingleFetchOptions = {},
): Promise<StrapiSingleFetchResult<T>> {
  const preview = await previewFetchOptions();
  if (preview.status && !preview.context) return { state: "invalid" };
  const exactCollection = preview.context
    ? previewCollectionForUid(preview.context.uid)
    : null;
  const requestedLocale =
    opts.locale ?? (await getRequestLocaleSafe());
  const isExactPreviewRequest = Boolean(
    preview.status &&
      exactCollection === collection &&
      preview.context?.locale === requestedLocale,
  );
  if (isExactPreviewRequest && !strapiConfig.apiToken) {
    return { state: "unauthorized" };
  }

  const requestLocale = async (locale: Locale) => {
    const params = new URLSearchParams();
    if (opts.populate) {
      const populateStr = populateParam(opts.populate);
      populateStr.split("&").forEach((part) => {
        const [key, value] = part.split("=");
        params.append(key, value);
      });
    }
    params.set("locale", locale);
    if (isExactPreviewRequest) params.set("status", preview.status!);
    const url = `${strapiConfig.apiUrl}/api/${collection}?${params.toString()}`;
    // A Preview context names one edited document. Supporting Single Type
    // reads must remain published and must not be compared with that other
    // document's ID (for example a Homepage read during a navigation-item
    // Preview).
    const documentId = isExactPreviewRequest
      ? preview.context!.documentId
      : undefined;
    const fetchWithAuth = async (useToken: boolean) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4_000);
      try {
        return await fetch(url, {
          signal: controller.signal,
          next:
            preview.cache === "no-store"
              ? undefined
              : {
                  revalidate: opts.revalidate ?? 60,
                  tags: cmsFetchTags(collection, locale, documentId),
                },
          cache: preview.cache,
          headers:
            useToken && strapiConfig.apiToken
              ? { Authorization: `Bearer ${strapiConfig.apiToken}` }
              : undefined,
        });
      } finally {
        clearTimeout(timeout);
      }
    };

    let res = await fetchWithAuth(Boolean(strapiConfig.apiToken));
    if (
      (res.status === 401 || res.status === 403) &&
      strapiConfig.apiToken &&
      !isExactPreviewRequest
    ) {
      res = await fetchWithAuth(false);
    }
    if (res.status === 401) {
      return { state: "unauthorized", status: res.status } as const;
    }
    if (res.status === 403) {
      return { state: "forbidden", status: res.status } as const;
    }
    if (!res.ok) {
      return { state: "unavailable", status: res.status } as const;
    }
    try {
      const response = (await res.json()) as StrapiSingleResponse<T>;
      if (!response.data) {
        return preview.status
          ? ({ state: "invalid" } as const)
          : ({ state: "empty" } as const);
      }
      if (
        isExactPreviewRequest &&
        !isExactSingleDocument(response, documentId as string)
      ) {
        return { state: "invalid" } as const;
      }
      return { state: "success", response } as const;
    } catch {
      return { state: "invalid", status: res.status } as const;
    }
  };

  try {
    let result = await requestLocale(requestedLocale);
    if (
      !preview.status &&
      requestedLocale === "id" &&
      result.state === "empty"
    ) {
      result = await requestLocale("en");
    }
    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("[motorsport-cms] Single Type request unavailable", {
        collection,
        preview: Boolean(preview.status),
        reason: error instanceof Error ? error.name : "unknown",
      });
    }
    return { state: "unavailable" };
  }
}

export async function fetchStrapiSingle<T>(
  collection: string,
  opts: SingleFetchOptions = {},
): Promise<StrapiSingleResponse<T> | null> {
  const result = await fetchStrapiSingleResult<T>(collection, opts);
  if (result.state === "success") return result.response ?? null;
  if (result.state === "empty") return null;

  const preview = await previewFetchOptions();
  const isPreviewTarget = Boolean(
    preview.context && previewCollectionForUid(preview.context.uid) === collection,
  );
  // See the list reader above: an invalid preview cookie is not an exact
  // target and must fall back to published content instead of rendering a 500.
  if (preview.status && preview.context && isPreviewTarget) {
    throw new StrapiPreviewFetchError(result.state, collection);
  }

  if (process.env.NODE_ENV !== "test") {
    console.warn("[motorsport-cms] Published Single Type read fell back", {
      collection,
      state: result.state,
      status: result.status,
    });
  }
  return null;
}
