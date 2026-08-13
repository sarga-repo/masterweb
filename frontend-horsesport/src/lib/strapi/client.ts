/**
 * Lightweight Strapi REST client for the Sarga Horse Sport frontend.
 *
 * Queries the shared CMS (siteScope = "horsesport" | "shared") and returns
 * typed results. Every call is wrapped in a try/catch so pages always render -
 * falling back to curated placeholder content when the API is unreachable
 * (local dev without Strapi, CI, etc.).
 */

import { strapiConfig } from "./config";
import type { Locale } from "@/lib/i18n/config";
import { getRequestLocaleSafe } from "@/lib/i18n/request";

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

export type FetchOptions = {
  populate?: string | string[];
  filters?: Record<string, string>;
  sort?: string;
  limit?: number;
  start?: number;
  revalidate?: number;
  locale?: Locale;
};

function buildQs(opts: FetchOptions): string {
  const params = new URLSearchParams();
  if (opts.populate) {
    const populateStr = populateParam(opts.populate);
    populateStr.split("&").forEach((p) => {
      const [key, value] = p.split("=");
      params.append(key, value);
    });
  }
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.limit != null)
    params.set("pagination[pageSize]", String(opts.limit));
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
export async function fetchStrapiList<T>(
  collection: string,
  opts: FetchOptions = {},
): Promise<StrapiListResponse<T> | null> {
  const requestedLocale = opts.locale ?? (await getRequestLocaleSafe());
  const requestLocale = async (locale: Locale) => {
    const query = buildQs(opts);
    const url = `${strapiConfig.apiUrl}/api/${collection}${query}${query ? "&" : "?"}locale=${locale}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4_000);
    const res = await fetch(url, {
      signal: controller.signal,
      next:
        opts.revalidate != null ? { revalidate: opts.revalidate } : undefined,
      headers: strapiConfig.apiToken
        ? { Authorization: `Bearer ${strapiConfig.apiToken}` }
        : undefined,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[strapi] ${res.status} for ${collection}`);
      }
      return null;
    }
    return (await res.json()) as StrapiListResponse<T>;
  };
  try {
    let response = await requestLocale(requestedLocale);
    let resolvedLocale = requestedLocale;
    if (requestedLocale === "id" && (!response || response.data.length === 0)) {
      response = await requestLocale("en");
      resolvedLocale = "en";
    }
    return response
      ? {
          ...response,
          localization: {
            requestedLocale,
            resolvedLocale,
            isFallback: requestedLocale !== resolvedLocale,
          },
        }
      : null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[strapi] request failed for ${collection}:`,
        error instanceof Error ? error.message : error,
      );
    }
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Mutations (server-side only)                                              */
/* -------------------------------------------------------------------------- */

export type StrapiMutationResult = {
  ok: boolean;
  status?: number;
  error?: string;
};

/** True when a Strapi base URL is available (always true given the fallback). */
export function isStrapiConfigured(): boolean {
  return Boolean(strapiConfig.apiUrl);
}

/**
 * POST JSON to a Strapi collection (server-side only). Used for inquiry/form
 * submissions. Returns a structured result instead of throwing so callers can
 * degrade gracefully.
 */
export async function strapiPost(
  path: string,
  data: Record<string, unknown>,
): Promise<StrapiMutationResult> {
  if (!isStrapiConfigured()) {
    return { ok: false, error: "Strapi is not configured." };
  }

  const base = strapiConfig.apiUrl.replace(/\/$/, "");
  const url = `${base}/api/${path.replace(/^\//, "")}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (strapiConfig.apiToken) {
    headers.Authorization = `Bearer ${strapiConfig.apiToken}`;
  }

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
