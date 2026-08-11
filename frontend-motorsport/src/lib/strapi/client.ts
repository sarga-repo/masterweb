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

type FetchOptions = {
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
    // Append populate parameters (may contain multiple &populate[...]=true)
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
    const separator = buildQs(opts) ? "&" : "?";
    const url = `${strapiConfig.apiUrl}/api/${collection}${buildQs(opts)}${separator}locale=${locale}`;
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
    if (!res.ok) return null;
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
  } catch {
    return null;
  }
}
