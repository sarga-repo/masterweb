import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  MotorsportMetricGroup,
  MotorsportPageInformationBand,
  PageComingSoon,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import {
  fetchLeadership,
  fetchSitePage,
  mapAboutCapabilities,
  type AboutCapability,
  type SitePageContent,
} from "@/lib/cms-data";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";
import { isCmsPageVisible, isCmsSectionVisible } from "@/lib/cms-visibility";
import type { TeamMember } from "@/types/design-system";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = await fetchSitePage("about");
  return createMetadata({
    title: page?.title ?? "About",
    description:
      page?.heroDescription ??
      "Sarga Motorsport is Indonesia's premium racing platform—professional competition, talent development, event experience, and media.",
    path: "/about",
    image: page?.heroImage,
    seo: page?.seo
      ? {
          metaTitle: page.seo.metaTitle,
          metaDescription: page.seo.metaDescription,
          ogTitle: page.seo.ogTitle,
          ogDescription: page.seo.ogDescription,
          ogImageUrl: page.seo.ogImage?.url,
          canonicalUrl: page.seo.canonicalUrl,
          noIndex: page.seo.noIndex,
        }
      : undefined,
    locale,
    isFallback: locale === "id" && !page,
  });
}

const FALLBACK_TEAM: TeamMember[] = [
  {
    name: "Farry Ongko Widjaja",
    role: "President Director",
    group: "board",
    portrait: "/media/sarga-motorsport-race-nascar-1.png",
    portraitAlt: "Sarga leadership portrait placeholder",
  },
  {
    name: "Diana Airin",
    role: "Chief Operating Officer",
    group: "executive",
    portrait: "/media/motorcycle-racing-dusk.png",
    portraitAlt: "Sarga leadership portrait placeholder",
  },
  {
    name: "Zaki Maulani",
    role: "Head of Partnerships",
    group: "executive",
    portrait: "/media/sarga-motorsport-bike-and-rally.png",
    portraitAlt: "Sarga leadership portrait placeholder",
  },
];

const FALLBACK_CAPABILITIES = [
  [
    "01",
    "Professional competition",
    "Touring, GT, rallycross, and motorcycle racing delivered to international sporting standards.",
  ],
  [
    "02",
    "Talent development",
    "Clear pathways that help Indonesia's next generation of riders and racing professionals progress.",
  ],
  [
    "03",
    "Event experience",
    "Race weekends shaped through fan access, hospitality, culture, and high-energy live programming.",
  ],
  [
    "04",
    "Media & partnerships",
    "Broadcast-ready stories and commercial platforms that extend beyond the chequered flag.",
  ],
];

function sectionBody(
  sections: SitePageContent["sections"] | undefined,
  key: string,
  fallback: string,
) {
  return (
    sections?.find((section) => section.sectionKey === key)?.body || fallback
  );
}

function sectionValue(
  sections: SitePageContent["sections"] | undefined,
  key: string,
  field: "eyebrow" | "title" | "body",
  fallback: string,
) {
  return (
    sections?.find((section) => section.sectionKey === key)?.[field] || fallback
  );
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const [page, cmsTeam] = await Promise.all([
    fetchSitePage("about", undefined, locale),
    fetchLeadership(locale),
  ]);
  const isPreview = await isStrapiPreviewEnabled();
  const team =
    isPreview || cmsTeam.length > 0 ? cmsTeam.slice(0, 6) : FALLBACK_TEAM;
  const operatingIdea = sectionValue(
    page?.sections,
    "operating-idea",
    "body",
    "Competition creates the moment. People, media, hospitality, and development turn it into a lasting Motorsport culture.",
  );
  const profile = page?.sections.find(
    (section) => section.sectionKey === "profile",
  );
  const capabilitiesSection = page?.sections.find(
    (section) => section.__component === "motorsport.about-capabilities",
  );
  const teamIntro = page?.sections.find(
    (section) => section.sectionKey === "team-intro",
  );
  const contactCta = page?.sections.find(
    (section) => section.sectionKey === "contact-cta",
  );
  const ecosystemCta = page?.sections.find(
    (section) => section.sectionKey === "ecosystem-cta",
  );
  const capabilities = mapAboutCapabilities(page?.sections);
  const capabilityCards: AboutCapability[] = capabilities
    ? capabilities.cards
    : capabilitiesSection
      ? []
      : FALLBACK_CAPABILITIES.map(([, title, description]) => ({
          title,
          description,
        }));

  return (
    <PageShell spectrumSeparators>
      {!isCmsPageVisible(page?.pageAvailability) ? (
        <PageComingSoon
          availability={page?.pageAvailability ?? { pageEnabled: false }}
        />
      ) : null}
      {isCmsPageVisible(page?.pageAvailability) ? (
        <div
          data-cms-section-key="hero"
          data-cms-enabled="true"
          data-cms-source={page ? "strapi" : "fallback"}
        >
          <PageHero
            kicker={page?.hero?.eyebrow ?? "The Adrenaline Alchemist"}
            kickerColor="yellow"
            title={page?.hero?.title ?? page?.heroTitle ?? "About Sarga Motorsport"}
            description={
              page?.hero?.description ??
              "We transform raw speed into cultural energy through professional competition, talent development, premium events, and media."
            }
            showKicker={page?.hero?.showEyebrow}
            showTitle={page?.hero?.showTitle}
            showDescription={page?.hero?.showDescription}
            showMedia={page?.hero?.showMedia}
            backgroundImage={page?.heroImage}
            backgroundAlt={page?.heroImageAlt ?? "Sarga Motorsport"}
          >
            <MotorsportMetricGroup
              items={
                page?.hero?.showMetricGroup === false
                  ? []
                  : page?.hero?.metrics?.length
                    ? page.hero.metrics
                    : [
                        { label: "Property", value: "Motorsport" },
                        { label: "Region", value: "Indonesia" },
                        { label: "Standard", value: "International" },
                      ]
              }
              className="max-w-3xl"
            />
          </PageHero>
        </div>
      ) : null}
      {isCmsPageVisible(page?.pageAvailability) ? (
        <div data-cms-section-key="information-band" data-cms-enabled="true">
          <MotorsportPageInformationBand
            band={page?.informationBand}
            fallback={{
              eyebrow: "About control / Motorsport platform",
              title: "Competition creates the moment.",
              description:
                "Professional competition, talent development, event experience, and media move the Sarga Motorsport platform forward.",
              metrics: [
                { label: "Property", value: "Motorsport" },
                { label: "Region", value: "Indonesia" },
                { label: "Standard", value: "International" },
              ],
            }}
          />
        </div>
      ) : null}

      {isCmsPageVisible(page?.pageAvailability) &&
      isCmsSectionVisible(profile) ? (
        <section
          data-cms-section-key="profile"
          data-cms-enabled="true"
          className="ms-about-story-surface ms-editorial-surface pb-20 sm:pb-28"
        >
          <div className="ms-shell">
            <figure className="relative aspect-[16/9] overflow-hidden bg-ms-cream-200 sm:aspect-[16/7]">
              <ResilientImage
                src={
                  page?.heroImage ||
                  "/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
                }
                alt={
                  page?.heroImageAlt ||
                  "Driver and pit crew preparing a touring car in a warm daylight paddock"
                }
                fallbackSrc="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
                fallbackAlt="Driver and pit crew preparing a touring car in a warm daylight paddock"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              {profile?.showMedia !== false ? (
                <figcaption className="absolute bottom-0 left-0 max-w-xs bg-ms-apex-crimson px-6 py-4 text-ms-warm-white sm:px-8">
                  <span className="ms-data-label text-ms-electric-yellow">
                    {profile?.supportLabel ?? "Profile / Indonesia"}
                  </span>
                </figcaption>
              ) : null}
            </figure>

            <div className="grid gap-12 pt-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,.65fr)] lg:gap-20 lg:pt-20">
              <article>
                {profile?.showIndex !== false ? (
                  <p className="ms-kicker text-ms-electric-yellow">
                    {profile?.indexLabel ?? "01 / Who we are"}
                  </p>
                ) : null}
                {profile?.showTitle !== false ? (
                  <h2 className="ms-heading-section mt-6 max-w-[13ch] text-ms-warm-white">
                    {profile?.title ?? "A stage built for velocity."}
                  </h2>
                ) : null}
                {profile?.showBody !== false ? (
                  <p className="mt-8 max-w-3xl text-lg leading-8 text-ms-warm-white/72">
                    {sectionBody(
                      page?.sections,
                      "profile",
                      "Sarga Motorsport is the dedicated racing property within the Sarga ecosystem. We unite professional racing, live-event production, community, hospitality, and editorial storytelling in one focused platform.",
                    )}
                  </p>
                ) : null}
              </article>

              <aside className="border-t border-ms-warm-white/18 pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <p className="ms-data-label text-ms-slipstream-teal">
                  {sectionValue(
                    page?.sections,
                    "operating-idea",
                    "eyebrow",
                    "Operating idea",
                  )}
                </p>
                <p className="mt-5 text-base leading-7 text-ms-warm-white/68">
                  {operatingIdea}
                </p>
                <Link
                  href="#team"
                  className="group mt-8 inline-flex items-center gap-3 border-b border-ms-electric-yellow/45 pb-3 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
                >
                  Meet the leadership
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </aside>
            </div>
          </div>
        </section>
      ) : null}

      {isCmsPageVisible(page?.pageAvailability) &&
      isCmsSectionVisible(capabilitiesSection) ? (
        <section
          data-cms-section-key="about-capabilities"
          data-cms-enabled="true"
          className="ms-about-capabilities ms-reflected-light-surface ms-editorial-surface ms-section"
        >
          <div className="ms-shell">
            <SectionHeader
              index={capabilities?.indexLabel ?? "CAPABILITY"}
              showIndex={capabilities?.showIndex}
              showEyebrow={capabilities?.showEyebrow}
              showTitle={capabilities?.showTitle}
              showDescription={capabilities?.showDescription}
              eyebrow={capabilities?.eyebrow ?? "What we do"}
              title={
                capabilities?.title ??
                "Competition is the core. Experience completes it."
              }
              description={
                capabilities?.description ??
                sectionBody(
                  page?.sections,
                  "what-we-do",
                  "Professional competition, event experiences, media, partnerships, and talent development—designed as one connected Motorsport system.",
                )
              }
            />
            <div className="mt-14 border-y border-ms-warm-white/18 md:grid md:grid-cols-2">
              {capabilityCards.map((card, index) => (
                <article
                  key={index}
                  className="border-b border-ms-warm-white/14 px-0 py-9 md:px-8 md:odd:border-r md:first:pl-0"
                >
                  <span className="ms-data-label text-ms-electric-yellow">
                    {card.indexLabel || String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="ms-heading-card mt-7 max-w-[16ch] text-ms-warm-white">
                    {card.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-ms-warm-white/68">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isCmsPageVisible(page?.pageAvailability) &&
      isCmsSectionVisible(teamIntro) ? (
        <section
          id="team"
          data-cms-section-key="team-intro"
          data-cms-enabled="true"
          className="ms-about-team-surface ms-editorial-surface ms-section"
        >
          <div className="ms-shell">
            <SectionHeader
              index={teamIntro?.indexLabel ?? "TEAM"}
              showIndex={teamIntro?.showIndex}
              showEyebrow={teamIntro?.showEyebrow}
              showTitle={teamIntro?.showTitle}
              showDescription={teamIntro?.showBody}
              eyebrow={teamIntro?.eyebrow ?? "Meet the team"}
              title={teamIntro?.title ?? "The people behind the programme."}
              description={
                teamIntro?.body ??
                "Group leadership and operators building the sporting, commercial, and live-event platform."
              }
            />
            <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
              {team.map((member, index) => (
                <article key={`${member.name}-${member.role}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-ms-charcoal">
                    <ResilientImage
                      src={member.portrait}
                      alt={member.portraitAlt}
                      fallbackSrc={
                        index % 2 === 0
                          ? "/media/sarga-motorsport-race-nascar-1.png"
                          : "/media/motorcycle-racing-dusk.png"
                      }
                      fallbackAlt="Sarga Motorsport team"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition duration-500 hover:scale-[1.015]"
                    />
                  </div>
                  <div className="border-b border-ms-warm-white/18 py-5">
                    <p className="ms-data-label text-ms-slipstream-teal">
                      {member.group || "team"}
                    </p>
                    <h3 className="mt-3 font-display text-2xl uppercase leading-none text-ms-warm-white">
                      {member.name}
                    </h3>
                    {member.role ? (
                      <p className="mt-2 text-sm text-ms-warm-white/68">
                        {member.role}
                      </p>
                    ) : null}
                    {member.summary ? (
                      <p className="mt-4 text-sm leading-6 text-ms-warm-white/58">
                        {member.summary}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isCmsPageVisible(page?.pageAvailability) &&
      (isCmsSectionVisible(contactCta) || isCmsSectionVisible(ecosystemCta)) ? (
        <section
          id="part-of-sarga"
          data-cms-section-key="about-ctas"
          data-cms-enabled="true"
          className="ms-about-ctas-surface ms-editorial-dark-surface ms-section"
        >
          <div className="ms-shell grid gap-12 lg:grid-cols-2 lg:gap-20">
            {isCmsSectionVisible(contactCta) ? (
              <article>
                <p className="ms-kicker text-ms-ignition-orange">
                  {contactCta?.eyebrow ?? "Contact us"}
                </p>
                <h2 className="ms-heading-section mt-6 max-w-[11ch]">
                  {contactCta?.title ??
                    "Start a conversation with race control."}
                </h2>
                <p className="mt-6 max-w-xl leading-7 text-ms-warm-white/72">
                  {contactCta?.body ??
                    "Partnerships, media, event support, talent pathways, and general Motorsport inquiries are routed through the contact desk."}
                </p>
                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-4 border-b border-ms-warm-white/55 pb-3 text-[0.65rem] font-black uppercase tracking-[0.16em]"
                >
                  Contact Sarga Motorsport
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ) : null}
            {isCmsSectionVisible(ecosystemCta) ? (
              <article className="border-t border-ms-warm-white/18 pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                <p className="ms-kicker text-ms-slipstream-teal">
                  {ecosystemCta?.eyebrow ?? "Part of Sarga.co"}
                </p>
                <h2 className="ms-heading-section mt-6 max-w-[11ch]">
                  {ecosystemCta?.title ??
                    "One ecosystem. A dedicated racing home."}
                </h2>
                <p className="mt-6 max-w-xl leading-7 text-ms-warm-white/72">
                  {ecosystemCta?.body ??
                    "Sarga.co remains the group gateway. This dedicated site is where Motorsport programmes, events, stories, tickets, and fan culture live in full."}
                </p>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
