import { fetchHomepageData } from "@/lib/homepage-data";
import {
  HeroRaceSection,
  TicketCtaPanel,
  GalleryMosaic,
  PartnerLogoStrip,
  NewsletterBand,
  CrossSiteEcosystemLinks,
} from "@/components";
import { SectionHeader } from "@/components/ui/section-header";
import { RaceEventCard } from "@/components/cards/race-event-card";
import { NewsArticleCard } from "@/components/cards/news-article-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { GATEWAY_LINK, MOTORSPORT_LINK } from "@/lib/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Homepage() {
  const data = await fetchHomepageData();
  const seasonEvents = data.seasonEvents.slice(0, 6);
  const aboutImage =
    data.gallery[2] ??
    data.gallery[0] ??
    (data.featuredArticle?.image
      ? {
          id: "about-image",
          image: data.featuredArticle.image,
          imageAlt: data.featuredArticle.imageAlt ?? data.featuredArticle.title,
          category: data.featuredArticle.category,
        }
      : null);
  const newsList = (
    data.featuredArticle
      ? [data.featuredArticle, ...data.articles]
      : data.articles
  ).slice(0, 3);

  return (
    <>
      {/* ================================================================ */}
      {/*  HERO - Full-bleed cinematic race-day opener                       */}
      {/* ================================================================ */}
      <HeroRaceSection
        eyebrow="Sarga Horse Sport"
        title={data.featuredEvent?.title ?? "Where champions are made."}
        description={
          data.featuredEvent
            ? `${data.featuredEvent.venue ?? ""} - ${data.featuredEvent.dateLabel ?? ""}`.replace(
                /^ - /,
                "",
              )
            : "Championship equestrian sport, premium hospitality, and race-day experiences at international standard."
        }
        image="/media/horse-sport-hero.png"
        imageAlt="Jockeys racing thoroughbreds across a championship turf track at golden hour"
        video={{
          webm: "/media/a_dynamic_action_sports_scene_at_a_horse_racetrack.webm",
          mp4: "/media/a_dynamic_action_sports_scene_at_a_horse_racetrack.mp4",
          poster: "/media/a_dynamic_action_sports_scene_at_a_horse_racetrack.png",
          objectClassName: "object-cover object-center",
        }}
        primaryCta={
          data.featuredEvent
            ? { label: "View race day", href: data.featuredEvent.href }
            : { label: "View events", href: "/events" }
        }
        secondaryCta={{ label: "Get tickets", href: "/tickets" }}
        stats={[
          { label: "Season events", value: String(data.seasonEvents.length) },
          { label: "Race venues", value: "3" },
          { label: "Partners", value: String(data.partners.length) },
          { label: "Years legacy", value: "10+" },
        ]}
        priority
      />

      {/* ================================================================ */}
      {/*  ABOUT - Editorial brand statement with warm scrim                */}
      {/* ================================================================ */}
      <section className="hs-section relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-16 -z-0 size-[28rem] rounded-full opacity-[0.05] blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(255 107 0 / 0.6), transparent 70%)",
          }}
        />
        <div className="hs-shell relative">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] xl:items-end">
            <ScrollReveal>
              <div>
                <SectionHeader
                  index="01"
                  eyebrow="About Sarga Horse Sport"
                  title={data.about.title}
                  description={data.about.body}
                />
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link href="/about" className="hs-cta-secondary">
                    <span className="px-3">Learn more</span>
                    <span className="hs-cta-icon-circle">
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </Link>
                  <div className="hidden items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-hs-cream/55 sm:inline-flex">
                    <span className="inline-flex size-2 rounded-full bg-hs-orange/60" />
                    premium hospitality
                    <span className="inline-flex size-2 rounded-full bg-hs-red/60" />
                    championship standard
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div>
                {aboutImage?.image ? (
                  <div className="hs-card-glass relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={aboutImage.image}
                      alt={aboutImage.imageAlt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 30rem"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5"
                    />
                    <span className="hs-kicker absolute right-4 top-4 text-hs-cream/55">
                      Since 2023
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="hs-kicker text-hs-orange">Race-day culture</p>
                      <p className="mt-2 max-w-[24rem] text-sm leading-6 text-hs-white">
                        An elite sporting platform with venue craft, paddock
                        theatre, and long-view stewardship.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Simple line-divided points - consistent with the hero stat rail */}
                <div className="mt-8 border-t border-hs-cream/14">
                  {[
                    "National-scale race calendar",
                    "Stable, turf, and hospitality as one system",
                    "Investor-facing premium presentation",
                  ].map((point, i) => (
                    <div
                      key={point}
                      className="flex items-baseline gap-5 border-b border-hs-cream/10 py-4"
                    >
                      <span className="hs-display text-sm text-hs-orange">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-6 text-hs-cream/75">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  MANIFESTO - Spacious editorial statement (investor tone)         */}
      {/* ================================================================ */}
      <section className="hs-section-tight relative overflow-hidden">
        <div className="hs-shell relative">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl text-center">
              {/* Top zigzag - left-aligned, fades out to the right */}
              <div
                aria-hidden
                className="mb-8 h-12 w-full max-w-2xl opacity-[0.58]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(90deg, black 0%, transparent 100%)",
                  maskImage:
                    "linear-gradient(90deg, black 0%, transparent 100%)",
                }}
              >
                <div className="hs-zigzag-pattern h-full w-full" />
              </div>

              <span className="hs-glass-chip mx-auto text-hs-orange">
                The Sarga standard
              </span>
              <p className="hs-display mt-8 text-[clamp(1.7rem,4.2vw,3.5rem)] leading-[1.06] tracking-tight text-hs-cream">
                A championship built to be watched, hosted, and{" "}
                <span className="hs-text-gradient">invested in.</span>
              </p>
              <div className="hs-rule-dot mx-auto mt-10 max-w-md">
                <span className="hs-kicker whitespace-nowrap text-hs-cream/55">
                  Est. 2023 · Indonesia
                </span>
              </div>

              {/* Bottom zigzag - right-aligned, mirrored shape, fades out to the left */}
              <div
                aria-hidden
                className="ml-auto mt-8 h-12 w-full max-w-2xl opacity-[0.58]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(90deg, transparent 0%, black 100%)",
                  maskImage:
                    "linear-gradient(90deg, transparent 0%, black 100%)",
                }}
              >
                <div className="hs-zigzag-pattern h-full w-full" style={{ transform: "scaleX(-1)" }} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  SEASON EVENTS - Premium race-day card grid                       */}
      {/* ================================================================ */}
      <section className="hs-section relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-24 -z-0 size-[28rem] rounded-full opacity-[0.05] blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(237 27 47 / 0.6), transparent 70%)",
          }}
        />
        <div className="hs-shell relative">
          <ScrollReveal>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
              <SectionHeader
                index="02"
                eyebrow="Season calendar"
                title="Championship race days."
                description="Curated events across derby, turf, and exhibition disciplines - each a destination for discerning spectators and stakeholders."
              />
              <div className="hidden border-l border-hs-orange/40 pl-5 xl:block">
                <p className="hs-kicker text-hs-orange">2026 outlook</p>
                <p className="mt-3 text-sm leading-7 text-hs-cream/52">
                  Six visible headline moments, structured to feel collectible
                  rather than repetitive.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {seasonEvents.length > 0 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {seasonEvents.map((event, i) => (
                <ScrollReveal key={event.href} delay={(i % 3) * 90}>
                  <RaceEventCard event={event} priority={i === 0} />
                </ScrollReveal>
              ))}
            </div>
          ) : null}

          <ScrollReveal delay={300}>
            <div className="mt-12 text-center">
              <Link href="/events" className="hs-cta-secondary">
                <span className="px-3">Full race calendar</span>
                <span className="hs-cta-icon-circle">
                  <ArrowRightIcon className="size-4" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  TICKET CTA - Ticket-stub capsule (sits close to the events grid) */}
      {/* ================================================================ */}
      {data.ticketCta ? (
        <section className="hs-shell pb-(--hs-section-gap)">
          <ScrollReveal>
            <TicketCtaPanel
              label={data.ticketCta.label}
              href={data.ticketCta.href}
              external={data.ticketCta.external}
              provider={data.ticketCta.provider}
              eventName={data.ticketCta.eventName}
              eventDate={data.featuredEvent?.dateLabel}
            />
          </ScrollReveal>
        </section>
      ) : null}

      {/* ================================================================ */}
      {/*  NEWS - Warm charcoal editorial band (subtle tonal rhythm)        */}
      {/* ================================================================ */}
      <section className="hs-charcoal-section hs-section relative overflow-hidden">
        <div aria-hidden className="hs-luxe-rule absolute inset-x-0 top-0 opacity-50" />
        <div className="hs-shell relative">
          <ScrollReveal>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
              <SectionHeader
                index="03"
                eyebrow="Stories & press"
                title="Inside the paddock."
                description="Race reports, stable features, venue spotlights, and the stories shaping championship equestrian sport."
              />
              <div className="hidden xl:flex xl:justify-end">
                <div className="rounded-full border border-hs-cream/12 bg-hs-cream/[0.04] px-4 py-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-hs-cream/45">
                  editorial desk / always on
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {newsList.map((article, i) => (
              <ScrollReveal key={article.href} delay={(i % 3) * 90}>
                <NewsArticleCard article={article} priority={i === 0} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="mt-12 text-center">
              <Link href="/news" className="hs-cta-secondary">
                <span className="px-3">All stories</span>
                <span className="hs-cta-icon-circle">
                  <ArrowRightIcon className="size-4" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  GALLERY - Asymmetrical Bento mosaic                              */}
      {/* ================================================================ */}
      {data.gallery.length > 0 ? (
        <section className="hs-section relative overflow-hidden">
          <div className="hs-shell relative">
            <ScrollReveal>
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
                <SectionHeader
                  index="04"
                  eyebrow="Gallery"
                  title="Moments from the turf."
                  description="A curated visual journey through race days, venues, and stable life - captured with an editorial lens."
                />
                <div className="hidden border-l border-hs-orange/40 pl-5 xl:block">
                  <p className="hs-kicker text-hs-orange">Visual archive</p>
                  <p className="mt-3 text-sm leading-7 text-hs-cream/50">
                    Built to feel like a private race journal, not a generic
                    image grid.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="mt-14">
                <GalleryMosaic items={data.gallery} featured />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mt-12 text-center">
                <Link href="/gallery" className="hs-cta-secondary">
                  <span className="px-3">View full gallery</span>
                  <span className="hs-cta-icon-circle">
                    <ArrowRightIcon className="size-4" />
                  </span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* ================================================================ */}
      {/*  NEWSLETTER + PARTNERS + ECOSYSTEM - one warm charcoal band       */}
      {/* ================================================================ */}
      <section className="hs-charcoal-section hs-section-tight relative overflow-hidden">
        <div aria-hidden className="hs-luxe-rule absolute inset-x-0 top-0 opacity-50" />
        <div className="hs-shell relative">
          <ScrollReveal>
            <NewsletterBand />
          </ScrollReveal>
          {data.partners.length > 0 ? (
            <ScrollReveal delay={120}>
              <div className="mt-12 border-t border-hs-cream/10 pt-10">
                <PartnerLogoStrip partners={data.partners} />
              </div>
            </ScrollReveal>
          ) : null}
          <ScrollReveal delay={200}>
            <div className="mt-14 border-t border-hs-cream/10 pt-12">
              <CrossSiteEcosystemLinks
                eyebrow="Part of the Sarga ecosystem"
                title="Explore the wider world of Sarga."
                links={[
                  {
                    ...GATEWAY_LINK,
                    label: "Sarga.co",
                    description: "The group gateway - corporate & investor portal.",
                    logo: "/media/logo-sarga-gateway-light.png",
                  },
                  {
                    ...MOTORSPORT_LINK,
                    label: "Sarga Motorsport",
                    description: "Adrenaline-fuelled racing, track days & lifestyle.",
                    logo: "/media/logo-sarga-motorsport.png",
                  },
                ]}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
