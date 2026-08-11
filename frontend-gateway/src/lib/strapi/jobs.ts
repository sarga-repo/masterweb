import "server-only";

import { safeLinkedInApplicationUrl } from "@/lib/careers/safe-application-url";
import { mapSeo, strapiFetchLocalized } from "@/lib/strapi/client";
import type { Locale } from "@/lib/i18n/config";
import type {
  JobVacancy,
  LocalizationState,
  RawJobVacancy,
  StrapiCollectionResponse,
} from "@/lib/strapi/types";

function mapJobVacancy(
  raw: RawJobVacancy,
  localization: LocalizationState,
): JobVacancy | null {
  if (
    raw.siteScope === "hidden" ||
    !raw.summary?.trim() ||
    !raw.description?.trim() ||
    !raw.location?.trim() ||
    !raw.postedDate
  ) {
    return null;
  }

  return {
    localization,
    title: raw.title,
    slug: raw.slug,
    discipline: raw.discipline,
    summary: raw.summary,
    description: raw.description,
    responsibilities: raw.responsibilities,
    requirements: raw.requirements,
    location: raw.location,
    employmentType: raw.employmentType ?? "full-time",
    workMode: raw.workMode ?? "onsite",
    seniority: raw.seniority,
    applicationUrl: safeLinkedInApplicationUrl(raw.applicationUrl),
    vacancyStatus: raw.vacancyStatus ?? "open",
    postedDate: raw.postedDate,
    closingDate: raw.closingDate,
    featured: raw.featured ?? false,
    order: raw.order ?? 0,
    siteScope: raw.siteScope === "shared" ? "shared" : "gateway",
    seo: mapSeo(raw.seo),
  };
}

export async function getJobVacancies(locale?: Locale): Promise<JobVacancy[]> {
  const query =
    "filters[siteScope][$ne]=hidden&populate[seo][populate]=*&sort[0]=featured:desc&sort[1]=order:asc&sort[2]=postedDate:desc&pagination[pageSize]=100";
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawJobVacancy>
  >("job-vacancies", { query, revalidate: 120, locale });
  const response = result.response;

  if (!response) return [];
  const localization = {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  };
  return response.data.flatMap((record) => {
    const vacancy = mapJobVacancy(record, localization);
    return vacancy ? [vacancy] : [];
  });
}

export async function getJobVacancyBySlug(
  slug: string,
  locale?: Locale,
): Promise<JobVacancy | null> {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&filters[siteScope][$ne]=hidden&populate[seo][populate]=*&pagination[pageSize]=1`;
  const result = await strapiFetchLocalized<
    StrapiCollectionResponse<RawJobVacancy>
  >("job-vacancies", { query, revalidate: 120, locale });
  const response = result.response;
  if (!response?.data[0]) return null;
  return mapJobVacancy(response.data[0], {
    requestedLocale: result.requestedLocale,
    resolvedLocale: result.resolvedLocale,
    isFallback: result.isFallback,
  });
}
