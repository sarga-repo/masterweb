import type { Metadata } from "next";

import { GalleryArchive, LightLineField, PageShell } from "@/components";
import { fetchGalleryItems, fetchSitePage } from "@/lib/cms-data";
import type { GalleryItem } from "@/types/design-system";

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

export default async function GalleryPage() {
  const [page, cmsItems] = await Promise.all([fetchSitePage("custom", "/gallery"), fetchGalleryItems()]);
  const intro = page?.sections.find((section) => section.sectionKey === "gallery-intro");
  const items = cmsItems.length >= 3 ? cmsItems : FALLBACK;

  return (
    <PageShell spectrumSeparators>
      <section className="ms-gallery-intro">
        <LightLineField />
        <div className="ms-shell relative z-10 grid gap-10 py-18 sm:py-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(17rem,.7fr)] lg:items-end">
          <div>
            <p className="ms-kicker text-ms-electric-yellow">
              {intro?.eyebrow ?? "Trackside capture feed"}
            </p>
            <h1 className="ms-heading-page mt-6 text-ms-warm-white">{page?.heroTitle ?? "Gallery"}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ms-warm-white/72">
              {page?.heroDescription ?? intro?.body ?? "Circuit, rally, motorcycle, paddock, people, and fan energy—one bright visual record of Motorsport in motion."}
            </p>
          </div>
          <dl className="grid grid-cols-3 border-l border-ms-warm-white/20">
            {[
              ["Frames", String(items.length).padStart(2, "0")],
              ["Format", "Editorial"],
              ["Scope", "Motorsport"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-r border-ms-warm-white/20 px-4 py-2"
              >
                <dt className="ms-data-label text-ms-slipstream-teal">
                  {label}
                </dt>
                <dd className="ms-tabular mt-3 text-xs font-extrabold uppercase tracking-[0.06em] text-ms-warm-white sm:text-sm">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="ms-gallery-wall ms-section">
        <div className="ms-shell">
          <div className="grid gap-8 border-t border-ms-warm-white/14 pt-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,.7fr)]">
            <div>
              <p className="ms-kicker text-ms-apex-crimson">
                SYS / Gallery / Published media
              </p>
              <h2 className="ms-heading-section mt-6 max-w-[12ch]">
                Motion, recorded.
              </h2>
            </div>
            <div className="self-end border-l border-ms-slipstream-teal/45 pl-5">
              <p className="ms-data-label text-ms-slipstream-teal">
                How to browse
              </p>
              <p className="mt-4 text-base leading-7 text-ms-warm-white/62">
                Filter the archive by discipline. Select any frame to open the
                full-screen viewer, then browse with the arrow controls.
              </p>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <GalleryArchive items={items.slice(0, 18)} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
