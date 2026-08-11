import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getEvents } from "@/lib/strapi/events";
import { dedicatedSiteLabel, resolveContentUrl } from "@/lib/cross-site";
import { createMetadata } from "@/lib/seo/metadata";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Ticket Hub",
    description:
      "Discover Sarga events and continue securely to approved ticketing partners.",
    path: "/ticket-hub",
    locale,
    isFallback: locale === "id",
  });
}

export default async function TicketHubPage() {
  const locale = await getRequestLocale();
  const events = await getEvents(locale);

  return (
    <>
      <InteriorHero
        index="04"
        eyebrow="Live access"
        title="Find the moment. Enter the arena."
        description="Discover Sarga's championship weekends and live experiences. Ticket transactions always continue through approved external partners."
        tone="red"
        meta={[
          "Partner redirect",
          "No internal payment",
          "Live event discovery",
          "Verified links only",
        ]}
      />

      <section className="bg-sarga-black py-20 text-white sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="01"
            eyebrow="Upcoming"
            title="Your next live experience starts here."
            description="Event availability and partner ticket links are published only after organizer approval."
            light
          />
          <div className="mt-14">
            {events.map((event) => {
              const { href, isExternal } = resolveContentUrl({
                slug: event.slug,
                contentType: "events",
                siteScope: event.siteScope,
              });
              return (
                <Link
                  key={event.slug}
                  href={href}
                  className="group grid overflow-hidden border border-white/20 lg:grid-cols-[1.2fr_0.8fr]"
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <div className="relative min-h-[24rem] overflow-hidden">
                    {event.coverImage ? (
                      <Image
                        src={event.coverImage.url}
                        alt={event.coverImage.alt}
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <span className="absolute left-6 top-6 bg-sarga-red px-4 py-3 text-[0.65rem] font-extrabold uppercase tracking-[0.16em]">
                      {event.status ?? "Upcoming"}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-2 gap-4 text-[0.62rem] font-bold uppercase leading-5 tracking-[0.14em] text-white/50">
                      <span>{event.eventDate ?? "Date to be announced"}</span>
                      <span>{event.venue ?? "Venue to be announced"}</span>
                    </div>
                    <div className="mt-20">
                      <h2 className="font-heading text-4xl font-bold uppercase leading-[0.94] tracking-[-0.035em] sm:text-[2.5rem]">
                        {event.title}
                      </h2>
                      <p className="mt-6 text-sm leading-7 text-white/58">
                        {event.description}
                      </p>
                      <span className="mt-10 inline-flex items-center gap-4 text-xs font-extrabold uppercase tracking-[0.16em]">
                        {isExternal
                          ? `View on ${dedicatedSiteLabel(event.siteScope)}`
                          : "View event details"}
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 border-l-2 border-sarga-red pl-6 text-sm leading-7 text-white/52">
            Sarga.co does not process ticket payments, create public ticketing
            accounts, or store payment credentials. Approved event pages
            redirect to trusted partner platforms.
          </div>
        </div>
      </section>
    </>
  );
}
