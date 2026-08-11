import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ComingSoonPage } from "@/components/sections/coming-soon-page";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { isSitePageLive } from "@/lib/strapi/site-pages";
import type { SitePage } from "@/lib/strapi/types";

export function GatewaySitePage({
  page,
  index = "01",
}: {
  page: SitePage;
  index?: string;
}) {
  if (!isSitePageLive(page)) {
    return (
      <ComingSoonPage
        name={page.title}
        description={
          page.heroDescription ??
          "This Sarga.co destination is being prepared for publication."
        }
        availability={page.pageAvailability}
        backHref="/about"
        backLabel="Back to About"
      />
    );
  }

  return (
    <>
      <InteriorHero
        index={index}
        eyebrow={page.navigationLabel ?? page.title}
        title={page.heroTitle ?? page.title}
        description={page.heroDescription ?? "Sarga.co corporate record."}
        image={page.heroMedia}
        meta={["Sarga.co", "Corporate record", page.pageKind]}
      />

      <section className="gateway-surface-light-signature bg-sarga-light py-20 sm:py-28 lg:py-36">
        <div className="site-container space-y-20">
          {page.sections.length ? (
            page.sections.map((section, sectionIndex) => (
              <article
                key={section.sectionKey}
                className="grid gap-10 border-t border-sarga-black/20 pt-8 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <EditorialHeading
                  index={String(sectionIndex + 1).padStart(2, "0")}
                  eyebrow={
                    section.eyebrow ?? page.navigationLabel ?? page.title
                  }
                  title={section.title}
                />
                <div className="lg:col-start-2">
                  {section.media ? (
                    <div className="relative mb-8 aspect-[16/9] overflow-hidden bg-sarga-black">
                      <Image
                        src={section.media.url}
                        alt={section.media.alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  {section.body ? (
                    <p className="max-w-2xl text-base leading-8 text-sarga-text-muted sm:text-lg">
                      {section.body}
                    </p>
                  ) : null}
                  {section.ctaLabel && section.ctaUrl ? (
                    <Link
                      href={section.ctaUrl}
                      target={
                        section.ctaTarget === "newWindow" ? "_blank" : undefined
                      }
                      rel={
                        section.ctaTarget === "newWindow"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group mt-8 inline-flex items-center gap-4 border-b border-sarga-black pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
                    >
                      {section.ctaLabel}
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <p className="border border-sarga-black/20 p-10 text-sm uppercase tracking-[0.16em] text-sarga-text-muted">
              Approved content is being prepared in the Sarga CMS.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
