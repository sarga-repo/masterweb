import "server-only";

import {
  absoluteMediaUrl,
  mapMedia,
  strapiFetchLocalized,
} from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  CorporateReport,
  CorporateReportType,
  LocalizationState,
  RawCorporateReport,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";

function approvedExternalUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function mapReport(
  raw: RawCorporateReport,
  localization: LocalizationState,
): CorporateReport | null {
  if (raw.siteScope === "hidden") return null;
  const fileUrl = absoluteMediaUrl(raw.reportFile?.url);
  return {
    localization,
    title: raw.title,
    slug: raw.slug,
    reportType: raw.reportType,
    year: raw.year,
    summary: raw.summary,
    coverImage: mapMedia(raw.coverImage, `${raw.title} cover`),
    file: fileUrl
      ? { url: fileUrl, name: raw.reportFile?.name ?? raw.title }
      : undefined,
    externalUrl: approvedExternalUrl(raw.externalUrl),
    publicationStatus: raw.publicationStatus ?? "forthcoming",
    publishedDate: raw.publishedDate,
    order: raw.order ?? 0,
    siteScope: raw.siteScope === "shared" ? "shared" : "gateway",
  };
}

export async function getCorporateReports(
  reportType: CorporateReportType,
  locale?: Locale,
): Promise<CorporateReport[]> {
  const query = `filters[reportType][$eq]=${reportType}&filters[siteScope][$ne]=hidden&populate[coverImage]=true&populate[reportFile]=true&sort[0]=year:desc&sort[1]=order:asc&pagination[pageSize]=100`;
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawCorporateReport>
  >("corporate-reports", { query, revalidate: 120, locale });
  const response = result.response;

  if (!response) return [];
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };
  return response.data.flatMap((record) => {
    const report = mapReport(record, localization);
    return report ? [report] : [];
  });
}
