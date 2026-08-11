import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { HomeAboutNavigator } from "@/components/sections/home-about-navigator";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { AboutTab } from "@/lib/mock-data";
import type { HomepageContent } from "@/lib/strapi/types";

export function AboutPreview({
  content,
  tabs,
}: {
  content: HomepageContent;
  tabs: AboutTab[];
}) {
  return (
    <section
      id="about"
      className="gateway-section-light relative isolate overflow-hidden text-sarga-text"
    >
      <div className="site-container relative z-10 py-20 sm:py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sarga-text-muted">
              <span className="text-sarga-red-dark">02</span>
              <span className="h-px w-12 bg-sarga-red-dark" />
              <span>{content.aboutEyebrow}</span>
            </div>
            <h2 className="gateway-section-title mt-8 max-w-[12ch] font-heading uppercase">
              Who we are, and how we move.
            </h2>
          </div>

          <div>
            <p className="gateway-body-lead text-sarga-text-muted">
              {content.aboutSummaryBody}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex w-fit items-center gap-5 border-b border-sarga-text pb-2 text-[0.68rem] font-extrabold uppercase tracking-[0.15em]"
            >
              About Sarga
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-14 sm:mt-18 lg:mt-20">
          <HomeAboutNavigator tabs={tabs} />
        </div>
      </div>
    </section>
  );
}
