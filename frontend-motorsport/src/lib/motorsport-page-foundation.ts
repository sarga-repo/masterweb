type StrapiMedia = {
  id: number;
  url: string;
  mime?: string;
  alternativeText?: string;
};

export type CmsPageHero = {
  isActive?: boolean;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showMedia?: boolean;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  backgroundMedia?: StrapiMedia | null;
  mobileBackgroundMedia?: StrapiMedia | null;
  backgroundAlt?: string | null;
  showMetricGroup?: boolean;
  metrics?: CmsInformationBandMetric[] | null;
};

export type CmsInformationBandMetric = {
  isActive?: boolean;
  label?: string | null;
  value?: string | null;
};

export type CmsPageInformationBand = {
  isActive?: boolean;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  showMetricGroup?: boolean;
  metrics?: CmsInformationBandMetric[] | null;
};

export type CmsNamedPageSection = {
  isActive?: boolean;
  showIndex?: boolean;
  indexLabel?: string | null;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showBody?: boolean;
  showMedia?: boolean;
  showCta?: boolean;
  supportLabel?: string | null;
  supportBody?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  media?: StrapiMedia | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  ctaTarget?: "sameWindow" | "newWindow" | null;
  theme?: "default" | "dark" | "light" | "accent" | null;
};

export type MotorsportHeroMedia = {
  url: string;
  mime?: string;
  alt?: string;
};

export type MotorsportPageHero = {
  isActive: boolean;
  showEyebrow: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showMedia: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  backgroundMedia?: MotorsportHeroMedia;
  mobileBackgroundMedia?: MotorsportHeroMedia;
  showMetricGroup: boolean;
  metrics: MotorsportInformationBandMetric[];
};

export type MotorsportInformationBandMetric = {
  label: string;
  value: string;
};

export type MotorsportPageInformationBand = {
  isActive: boolean;
  showEyebrow: boolean;
  showTitle: boolean;
  showDescription: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  showMetricGroup: boolean;
  metrics: MotorsportInformationBandMetric[];
};

export type MotorsportNamedPageSection = {
  isActive: boolean;
  showIndex: boolean;
  indexLabel?: string;
  showEyebrow: boolean;
  showTitle: boolean;
  showBody: boolean;
  showMedia: boolean;
  showCta: boolean;
  supportLabel?: string;
  supportBody?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  media?: MotorsportHeroMedia;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget: "sameWindow" | "newWindow";
  theme: "default" | "dark" | "light" | "accent";
};

function clean(value?: string | null) {
  const result = value?.trim();
  return result || undefined;
}

function mediaUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337"}${url}`;
}

function mapMedia(
  media: StrapiMedia | null | undefined,
  alt?: string | null,
): MotorsportHeroMedia | undefined {
  const url = mediaUrl(media?.url);
  if (!url) return undefined;
  return {
    url,
    mime: media?.mime,
    alt: clean(alt) ?? clean(media?.alternativeText),
  };
}
function mapMetrics(
  input?: CmsInformationBandMetric[] | null,
): MotorsportInformationBandMetric[] {
  return (input ?? [])
    .filter(
      (
        metric,
      ): metric is CmsInformationBandMetric & {
        label: string;
        value: string;
      } =>
        metric?.isActive !== false &&
        Boolean(clean(metric?.label)) &&
        Boolean(clean(metric?.value)),
    )
    .slice(0, 3)
    .map((metric) => ({
      label: clean(metric.label) as string,
      value: clean(metric.value) as string,
    }));
}

export function mapMotorsportPageHero(
  input: CmsPageHero | null | undefined,
): MotorsportPageHero | null {
  if (!input) return null;
  return {
    isActive: input.isActive !== false,
    showEyebrow: input.showEyebrow !== false,
    showTitle: input.showTitle !== false,
    showDescription: input.showDescription !== false,
    showMedia: input.showMedia !== false,
    eyebrow: clean(input.eyebrow),
    title: clean(input.title) ?? "",
    description: clean(input.description),
    backgroundMedia: mapMedia(input.backgroundMedia, input.backgroundAlt),
    mobileBackgroundMedia: mapMedia(
      input.mobileBackgroundMedia,
      input.backgroundAlt,
    ),
    showMetricGroup: input.showMetricGroup !== false,
    metrics: input.showMetricGroup === false ? [] : mapMetrics(input.metrics),
  };
}

export function mapMotorsportInformationBand(
  input: CmsPageInformationBand | null | undefined,
): MotorsportPageInformationBand | null {
  if (!input) return null;
  const showMetricGroup = input.showMetricGroup !== false;
  const metrics = showMetricGroup
    ? (input.metrics ?? [])
        .filter(
          (
            metric,
          ): metric is CmsInformationBandMetric & {
            label: string;
            value: string;
          } =>
            metric?.isActive !== false &&
            Boolean(clean(metric?.label)) &&
            Boolean(clean(metric?.value)),
        )
        .slice(0, 3)
        .map((metric) => ({
          label: clean(metric.label) as string,
          value: clean(metric.value) as string,
        }))
    : [];

  return {
    isActive: input.isActive !== false,
    showEyebrow: input.showEyebrow !== false,
    showTitle: input.showTitle !== false,
    showDescription: input.showDescription !== false,
    eyebrow: clean(input.eyebrow),
    title: clean(input.title) ?? "",
    description: clean(input.description),
    showMetricGroup,
    metrics,
  };
}

export function mapMotorsportNamedPageSection(
  input: CmsNamedPageSection | null | undefined,
): MotorsportNamedPageSection | null {
  if (!input) return null;
  return {
    isActive: input.isActive !== false,
    showIndex: input.showIndex !== false,
    indexLabel: clean(input.indexLabel),
    showEyebrow: input.showEyebrow !== false,
    showTitle: input.showTitle !== false,
    showBody: input.showBody !== false,
    showMedia: input.showMedia !== false,
    showCta: input.showCta !== false,
    supportLabel: clean(input.supportLabel),
    supportBody: clean(input.supportBody),
    eyebrow: clean(input.eyebrow),
    title: clean(input.title) ?? "",
    body: clean(input.body),
    media: mapMedia(input.media),
    ctaLabel: clean(input.ctaLabel),
    ctaUrl: clean(input.ctaUrl),
    ctaTarget: input.ctaTarget === "newWindow" ? "newWindow" : "sameWindow",
    theme: input.theme ?? "default",
  };
}

export function isExactSingleDocument(
  response: { data?: { documentId?: string } | null } | null | undefined,
  documentId: string,
) {
  return response?.data?.documentId === documentId;
}
