import type { Metadata } from "next";

import {
  GalleryArchive,
  MotorsportMetricGroup,
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  type GalleryFilterKey,
} from "@/components";
import { fetchGalleryItems, fetchSitePage } from "@/lib/cms-data";
import type { GalleryItem } from "@/types/design-system";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import { isCmsPageVisible, isCmsSectionVisible } from "@/lib/cms-visibility";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Trackside photography from Sarga Motorsport—racing, paddock, people, and fan energy captured in motion.",
};

const FALLBACK: GalleryItem[] = [
  {
    id: "g1",
    image: "/media/hero/sarga-motorsport-hero-circuit-golden-hour.jpg",
    imageAlt: "Red touring race car accelerating on a tropical circuit",
    eyebrow: "Circuit / Touring",
    caption: "The line comes alive",
  },
  {
    id: "g2",
    image: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
    imageAlt: "Superbike riders leaning through a tropical circuit corner",
    eyebrow: "Two wheels / Superbike",
    caption: "Lean into the limit",
  },
  {
    id: "g3",
    image: "/media/hero/sarga-motorsport-hero-rally-highlands.jpg",
    imageAlt: "Rally car racing across sunlit tropical highlands",
    eyebrow: "Mixed surface / Rally",
    caption: "Every surface is a stage",
  },
  {
    id: "g4",
    image: "/media/sarga-motorsport-discipline-rallycross-daylight.jpg",
    imageAlt: "Rallycross cars racing side by side on a tropical dirt circuit",
    eyebrow: "Mixed surface / Rallycross",
    caption: "Pressure without pause",
  },
  {
    id: "g5",
    image: "/media/sarga-motorsport-discipline-touring-daylight.jpg",
    imageAlt: "Touring cars sweeping through a tropical circuit",
    eyebrow: "Four wheels / Touring",
    caption: "Pressure in formation",
  },
  {
    id: "g6",
    image: "/media/hero/sarga-motorsport-hero-paddock-ready.jpg",
    imageAlt: "Driver and crew preparing a race car in a daylight paddock",
    eyebrow: "Paddock / People",
    caption: "Built before lights-out",
  },
];

type GalleryPageProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
};

const GALLERY_PAGE_SIZE = 1;
const GALLERY_CATEGORIES = [
  "race-day",
  "stable-life",
  "venue",
  "jockey",
  "hospitality",
  "press",
  "circuit",
  "two-wheels",
  "mixed-surface",
  "other",
] as const satisfies ReadonlyArray<Exclude<GalleryFilterKey, "all">>;

function parseGalleryCategory(value?: string): Exclude<GalleryFilterKey, "all"> | undefined {
  return GALLERY_CATEGORIES.includes(
    value as Exclude<GalleryFilterKey, "all">,
  )
    ? (value as Exclude<GalleryFilterKey, "all">)
    : undefined;
}

export default async function GalleryPage({
  searchParams,
}: GalleryPageProps) {
  const locale = await getRequestLocale();
  const query = await searchParams;
  const requestedPage = Number(query.page);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const activeCategory = parseGalleryCategory(query.category);
  const [page, galleryPage] = await Promise.all([
    fetchSitePage("custom", "/gallery", locale),
    fetchGalleryItems({
      page: currentPage,
      pageSize: 8,
      locale,
      category: activeCategory,
    }),
  ]);
  const isPreview = await isStrapiPreviewEnabled();
  const intro = page?.sections.find(
    (section) => section.sectionKey === "gallery-intro",
  );
  const archive = page?.sections.find(
    (section) => section.sectionKey === "gallery-archive",
  );
  const items = isPreview || galleryPage.items.length > 0
    ? galleryPage.items
    : FALLBACK;
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);
  const availableCategories = galleryPage.availableCategories.length
    ? galleryPage.availableCategories
    : ["circuit", "two-wheels", "mixed-surface"];

  return (
    <PageShell spectrumSeparators>
      {!pageAvailable ? (
        <PageComingSoon
          availability={page?.pageAvailability ?? { pageEnabled: false }}
        />
      ) : (
        <>
          {page?.heroEnabled !== false ? (
            <div
              data-cms-section-key="hero"
              data-cms-enabled="true"
              data-cms-source={page ? "strapi" : "fallback"}
            >
              <PageHero
                kicker={intro?.eyebrow ?? "Trackside capture feed"}
                kickerColor="yellow"
                title={page?.hero?.title ?? page?.heroTitle ?? "Gallery"}
                description={
                  page?.hero?.description ??
                  "Circuit, rally, motorcycle, paddock, people, and fan energy—one bright visual record of Motorsport in motion."
                }
                showKicker={page?.hero?.showEyebrow}
                showTitle={page?.hero?.showTitle}
                showDescription={page?.hero?.showDescription}
                showMedia={page?.hero?.showMedia}
                backgroundImage={page?.heroImage}
                backgroundAlt={page?.heroImageAlt || "Sarga Motorsport gallery scene"}
              >
                {isCmsSectionVisible(intro) ? (
                  <MotorsportMetricGroup
                    items={
                      page?.hero?.showMetricGroup === false
                        ? []
                        : page?.hero?.metrics?.length
                          ? page.hero.metrics
                          : [
                              {
                                label: "Frames",
                                value: String(items.length).padStart(2, "0"),
                              },
                              { label: "Format", value: "Editorial" },
                              { label: "Scope", value: "Motorsport" },
                            ]
                    }
                    labelClassName="text-ms-slipstream-teal"
                    className="max-w-3xl"
                  />
                ) : null}
              </PageHero>
            </div>
          ) : null}

          {pageAvailable ? (
            <div
              data-cms-section-key="information-band"
              data-cms-enabled="true"
            >
              <MotorsportPageInformationBand
                band={page?.informationBand}
                fallback={{
                  title: "Every frame carries the race forward.",
                  description:
                    "Trackside photography, rider energy, and paddock detail remain in one published Motorsport visual record.",
                  metrics: [
                    {
                      label: "Frames",
                      value: String(items.length).padStart(2, "0"),
                    },
                    { label: "Format", value: "Editorial" },
                    { label: "Scope", value: "Motorsport" },
                  ],
                }}
              />
            </div>
          ) : null}

          {isCmsSectionVisible(archive) ? (
            <section
              data-cms-section-key="gallery-archive"
              data-cms-enabled="true"
              className="ms-gallery-wall ms-gallery-archive-light ms-section"
            >
              <div className="ms-shell">
                <div className="grid gap-8 border-t border-ms-warm-white/14 pt-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,.7fr)]">
                  <div>
                    {archive?.showEyebrow !== false ? (
                      <p className="ms-kicker text-ms-apex-crimson">
                        {archive?.eyebrow ?? "SYS / Gallery / Published media"}
                      </p>
                    ) : null}
                    {archive?.showTitle !== false ? (
                      <h2 className="ms-heading-section mt-6 max-w-[12ch]">
                        {archive?.title ?? "Motion, recorded."}
                      </h2>
                    ) : null}
                  </div>
                  <div className="self-end border-l border-ms-slipstream-teal/45 pl-5">
                    {archive?.supportLabel ? (
                      <p className="ms-data-label text-ms-slipstream-teal">
                        {archive.supportLabel}
                      </p>
                    ) : null}
                    {archive?.showBody !== false ? (
                      <p className="mt-4 text-base leading-7 text-ms-warm-white/62">
                        {archive?.supportBody ?? archive?.body ??
                          "Filter the archive by discipline. Select any frame to open the full-screen viewer, then browse with the arrow controls."}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-12 sm:mt-16">
                  <GalleryArchive
                    items={items}
                    availableCategories={availableCategories}
                    activeFilter={activeCategory ?? "all"}
                    page={galleryPage.page}
                    pageCount={galleryPage.pageCount}
                  />
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
