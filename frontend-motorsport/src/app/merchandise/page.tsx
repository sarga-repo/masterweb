import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  MotorsportPageInformationBand,
  MerchandiseCatalog,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { fetchMerchandise, fetchSitePage } from "@/lib/cms-data";
import type { MerchandiseItem } from "@/types/design-system";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import { isCmsPageVisible, isCmsSectionVisible } from "@/lib/cms-visibility";

export const metadata: Metadata = {
  title: "Merchandise",
  description:
    "Preview official Sarga Motorsport merchandise. Availability is handled through approved partners or direct inquiry-no internal checkout.",
};

const FALLBACK_ITEMS: MerchandiseItem[] = [
  {
    title: "Sarga Motorsport Team Tee",
    slug: "sarga-motorsport-team-tee-preview",
    description:
      "Heavyweight cotton, an athletic streetwear cut, and the Sarga racing stripe translated for everyday wear.",
    image: "/media/merchandise/sarga-team-tee.jpg",
    imageAlt: "Warm-white Sarga Motorsport team T-shirt with racing stripes",
    priceLabel: "Coming soon",
    availability: "comingSoon",
  },
  {
    title: "Sarga Motorsport Track Cap",
    slug: "sarga-motorsport-track-cap-preview",
    description:
      "A structured performance cap with embroidered team branding and contrast apex detailing.",
    image: "/media/merchandise/sarga-track-cap.jpg",
    imageAlt: "Black embroidered Sarga Motorsport track cap",
    priceLabel: "Inquiry only",
    availability: "inquiryOnly",
    href: "/contact",
  },
  {
    title: "Sarga Motorsport Apex Jacket",
    slug: "sarga-motorsport-apex-jacket",
    description:
      "A technical paddock shell with race-panel construction, weather-ready fabric, and signature Sarga piping.",
    image: "/media/merchandise/sarga-apex-jacket.jpg",
    imageAlt: "Black Sarga Motorsport technical team jacket",
    priceLabel: "Coming soon",
    availability: "comingSoon",
  },
  {
    title: "Sarga Motorsport Garage Hoodie",
    slug: "sarga-motorsport-garage-hoodie",
    description:
      "Heavyweight brushed fleece with structured shoulders and a restrained team chest mark.",
    image: "/media/merchandise/sarga-garage-hoodie.jpg",
    imageAlt: "Black and red Sarga Motorsport garage hoodie",
    priceLabel: "Inquiry only",
    availability: "inquiryOnly",
    href: "/contact",
  },
  {
    title: "Sarga Motorsport Pit Lane Mug",
    slug: "sarga-motorsport-pit-lane-mug",
    description:
      "A substantial matte ceramic mug finished with the team wordmark and twin racing stripes.",
    image: "/media/merchandise/sarga-pit-lane-mug.jpg",
    imageAlt: "Matte-black Sarga Motorsport ceramic mug",
    priceLabel: "Coming soon",
    availability: "comingSoon",
  },
  {
    title: "Sarga Motorsport Paddock Backpack",
    slug: "sarga-motorsport-paddock-backpack",
    description:
      "A structured technical backpack with protected storage, durable hardware, and paddock-ready detailing.",
    image: "/media/merchandise/sarga-paddock-backpack.jpg",
    imageAlt: "Black Sarga Motorsport technical paddock backpack",
    priceLabel: "Inquiry only",
    availability: "inquiryOnly",
    href: "/contact",
  },
];

export default async function MerchandisePage() {
  const locale = await getRequestLocale();
  const [page, cmsItems] = await Promise.all([
    fetchSitePage("merchandise", undefined, locale),
    fetchMerchandise(locale),
  ]);
  const isPreview = await isStrapiPreviewEnabled();
  const items = isPreview || cmsItems.length > 0 ? cmsItems : FALLBACK_ITEMS;
  const control = page?.sections.find(
    (section) => section.sectionKey === "merch-control",
  );
  const finalCta = page?.sections.find(
    (section) => section.sectionKey === "merch-final-cta",
  );
  const catalog = page?.sections.find(
    (section) => section.sectionKey === "merchandise-catalog",
  );
  const pageAvailable = isCmsPageVisible(page?.pageAvailability);
  const externalCount = items.filter(
    (item) => item.availability === "availableExternal",
  ).length;

  return (
    <PageShell spectrumSeparators>
      {!pageAvailable ? (
        <PageComingSoon
          availability={page?.pageAvailability ?? { pageEnabled: false }}
        />
      ) : (
        <>
          {page?.heroEnabled !== false ? (
            <div data-cms-section-key="hero" data-cms-enabled="true">
              <PageHero
                kicker={page?.hero?.eyebrow ?? "Track culture / Product preview"}
                kickerColor="orange"
                title={page?.hero?.title ?? page?.heroTitle ?? "Merchandise"}
                description={page?.hero?.description ?? "Official Sarga Motorsport merchandise previews. Releases are handled through approved partners or direct inquiry."}
                showKicker={page?.hero?.showEyebrow}
                showTitle={page?.hero?.showTitle}
                showDescription={page?.hero?.showDescription}
                showMedia={page?.hero?.showMedia}
                backgroundImage={page?.heroImage || "/media/sarga-motorsport-race-nascar-2.png"}
                backgroundAlt={page?.heroImageAlt || "Sarga Motorsport race weekend atmosphere"}
                accent="orange"
                accentPosition="bottom-right"
                speedLines
                grain
              />
            </div>
          ) : null}

          {page?.informationBand || isCmsSectionVisible(control) ? (
            <div data-cms-section-key="merch-control" data-cms-enabled="true">
              <MotorsportPageInformationBand
                band={page?.informationBand}
                fallback={{
                  isActive: control?.enabled,
                  eyebrow:
                    control?.eyebrow ?? "Merch control / No internal commerce",
                  title:
                    control?.title ??
                    "Wear the velocity. Checkout stays with approved partners.",
                  description:
                    control?.body ??
                    "This is a showcase-not a store. Sarga Motorsport does not operate a cart, account, checkout, or payment system.",
                  metrics: [
                    {
                      label: "Preview items",
                      value: String(items.length).padStart(2, "0"),
                    },
                    {
                      label: "Partner links",
                      value: String(externalCount).padStart(2, "0"),
                    },
                    { label: "Checkout", value: "External only" },
                  ],
                }}
              />
            </div>
          ) : null}

          {isCmsSectionVisible(catalog) ? (
            <section
              data-cms-section-key="merchandise-catalog"
              data-cms-enabled="true"
              className="ms-merchandise-catalog-surface ms-reflected-light-surface ms-section"
            >
              <div className="ms-shell">
                <SectionHeader
                  index={catalog?.indexLabel ?? "MERCH"}
                  showIndex={catalog?.showIndex}
                  showEyebrow={catalog?.showEyebrow}
                  showTitle={catalog?.showTitle}
                  showDescription={catalog?.showBody}
                  eyebrow={catalog?.eyebrow ?? "Current showcase"}
                  title={
                    catalog?.title ??
                    "Made for the paddock. Ready for the street."
                  }
                  description={
                    catalog?.body ??
                    "CMS-managed previews make availability explicit before any visitor leaves for a partner destination. Catalogue pages hold no more than sixteen items on the four-column grid."
                  }
                />
                <div className="mt-14">
                  <MerchandiseCatalog items={items} />
                </div>
              </div>
            </section>
          ) : null}

          {isCmsSectionVisible(finalCta) ? (
            <section
              data-cms-section-key="merch-final-cta"
              data-cms-enabled="true"
              className="ms-merch-final-cta ms-blue-heat-surface pb-(--ms-section-space)"
            >
              <div className="ms-shell">
                <div className="ms-panel grid gap-8 bg-transparent p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <p className="ms-kicker text-ms-slipstream-teal">
                      {finalCta?.eyebrow ?? "Availability desk"}
                    </p>
                    <h2 className="ms-heading-section mt-5 max-w-[12ch]">
                      {finalCta?.title ?? "Need release or sizing information?"}
                    </h2>
                    <p className="mt-5 max-w-2xl leading-7 text-ms-warm-white/58">
                      {finalCta?.body ??
                        "Send a merchandise inquiry. The team can confirm whether an item is pending, inquiry-only, or available through an approved store."}
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="group inline-flex min-h-14 items-center gap-4 bg-ms-apex-crimson px-7 text-[0.64rem] font-black uppercase tracking-[0.16em] transition-colors hover:bg-ms-ignition-orange"
                  >
                    {finalCta?.ctaLabel ?? "Contact merchandise desk"}
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
