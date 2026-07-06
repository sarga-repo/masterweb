import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import type { HomepageContent } from "@/lib/strapi/types";

export function AboutPreview({ content }: { content: HomepageContent }) {
  return (
    <section
      id="about"
      className="gateway-section-light relative isolate overflow-hidden text-sarga-text"
    >
      <div className="site-container relative z-10 py-20 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sarga-text-muted">
              <span className="text-sarga-red-dark">02</span>
              <span className="h-px w-12 bg-sarga-red-dark" />
              <span>{content.aboutEyebrow}</span>
            </div>
            <h2 className="mt-8 max-w-[10ch] font-heading text-[clamp(3.25rem,10vw,4rem)] font-bold uppercase leading-[0.86] tracking-[-0.05em] sm:text-[clamp(3.25rem,4.8vw,4.8rem)]">
              One group. Every arena.
            </h2>
          </div>

          <div className="flex flex-col justify-end lg:pb-2">
            <p className="max-w-2xl text-xl leading-8 sm:text-2xl sm:leading-9">
              {content.aboutSummaryBody}
            </p>
            <Link
              href="/about"
              className="group mt-10 inline-flex w-fit items-center gap-5 border-b border-sarga-text pb-2 text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              Enter the corporate root
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>

        <div className="mt-20 grid overflow-hidden border border-sarga-border/80 bg-white shadow-[0_24px_70px_rgb(16_20_27_/_8%)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="gateway-360-panel relative isolate min-h-[25rem] overflow-hidden p-8 text-white sm:p-12 lg:min-h-[34rem]">
            <RacingGraphic
              variant="bands"
              className="absolute -right-[38%] top-0 -z-10 h-full w-[115%] text-white"
            />
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white">
              Integrated by design
            </span>
            <strong className="absolute bottom-0 left-5 font-heading text-[clamp(6rem,10vw,12.5rem)] font-bold leading-none tracking-[-0.09em] text-white sm:left-8">
              360°
            </strong>
          </div>

          <ol className="divide-y divide-sarga-border">
            {content.aboutHighlights.map((highlight, index) => (
              <li key={highlight.title} className="min-h-[17rem]">
                <Link
                  href={highlight.href}
                  className="group relative grid min-h-[17rem] gap-8 p-8 transition-colors duration-300 hover:bg-[#f7f6f3] focus-visible:bg-[#f7f6f3] focus-visible:outline-none sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:p-10 lg:p-12"
                >
                  {/* Left accent border on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-sarga-red transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                  <span className="font-heading text-3xl font-bold text-sarga-red-dark group-hover:text-sarga-orange group-focus-visible:text-sarga-orange">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sarga-red-dark group-hover:text-sarga-orange group-focus-visible:text-sarga-orange">
                      {highlight.label}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl font-bold uppercase leading-[1.02] tracking-[-0.025em] sm:text-3xl">
                      {highlight.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-sm leading-6 opacity-65 sm:text-base sm:leading-7">
                      {highlight.description}
                    </p>
                  </div>
                  <ArrowRightIcon className="hidden h-6 w-6 transition-transform duration-300 group-hover:translate-x-2 sm:block" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
