import type { Metadata } from "next";
import Link from "next/link";

import {
  BecomeRidersInquiryForm,
  InformationBand,
  PageHero,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getIjtcProgram, IJTC_BASE_PATH } from "@/lib/ijtc-data";

export const metadata: Metadata = {
  title: "Become Riders",
  description:
    "Send a rider development inquiry to the Indonesia Junior Talent Cup programme team.",
};

const PROCESS = [
  {
    index: "01",
    title: "Tell us your context",
    body: "Share your region, riding background, competition experience, and development goals.",
  },
  {
    index: "02",
    title: "Programme review",
    body: "The Motorsport team reviews the inquiry against current programme capacity and sporting requirements.",
  },
  {
    index: "03",
    title: "Direct follow-up",
    body: "If there is a relevant next step, the programme team contacts you through the submitted email address.",
  },
];

export default async function BecomeIjtcRiderPage() {
  const program = await getIjtcProgram();

  return (
    <>
      <PageHero
        kicker={`IJTC / ${program.seasonLabel}`}
        kickerColor="orange"
        title="Start your rider inquiry."
        description="Introduce your background to the Indonesia Junior Talent Cup programme team."
        backgroundImage="/media/sarga-motorsport-discipline-motorcycle-daylight.jpg"
        backgroundAlt="Motorcycle riders building race craft on a circuit"
        accent="crimson"
        accentPosition="bottom-right"
        surface="heat"
        speedLines
        grain
      />

      <InformationBand
        eyebrow="Programme entry / Direct inquiry"
        title="A conversation, not an automatic registration."
        description="Submitting this form does not create an account, guarantee selection, or confirm sporting eligibility."
        items={[
          { label: "Route", value: "Inquiry" },
          { label: "Account", value: "Not required" },
          { label: "Review", value: "Programme team" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,.88fr)]">
          <div>
            <SectionHeader
              index="INQUIRY"
              eyebrow="Become Riders"
              title="Put your experience on the radar."
              description="Complete the fields below with enough context for a meaningful programme review."
              align="left"
            />
            <div className="mt-12">
              <BecomeRidersInquiryForm />
            </div>
          </div>

          <aside className="ms-blue-panel ms-panel self-start p-7 sm:p-9 lg:sticky lg:top-36">
            <p className="ms-kicker text-ms-electric-yellow">
              Before you submit
            </p>
            <h2 className="ms-heading-card mt-5">What this inquiry means.</h2>
            <ul className="mt-8 space-y-5 text-sm leading-7 text-ms-warm-white/62">
              <li className="border-l border-ms-slipstream-teal/55 pl-5">
                Rider selection remains subject to programme criteria, capacity,
                age category, and sporting approval.
              </li>
              <li className="border-l border-ms-electric-yellow/55 pl-5">
                Final dates, venues, fees, equipment requirements, and
                eligibility are communicated through approved programme notices.
              </li>
              <li className="border-l border-ms-apex-crimson/55 pl-5">
                Do not submit sensitive identity, medical, licence, or payment
                information through this first-contact form.
              </li>
            </ul>
            <Link
              href={`${IJTC_BASE_PATH}/about`}
              className="group mt-10 inline-flex items-center gap-4 border-b border-ms-warm-white/25 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white"
            >
              Understand the programme
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="ms-blue-heat-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="PROCESS"
            eyebrow="What happens next"
            title="A clear path after send."
            description="The inquiry is reviewed by people, not converted into an automatic account or acceptance decision."
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {PROCESS.map((step) => (
              <article
                key={step.index}
                className="ms-blue-panel ms-panel min-h-72 p-7"
              >
                <span className="font-display text-xl text-ms-electric-yellow">
                  {step.index}
                </span>
                <h2 className="ms-heading-card mt-20">{step.title}</h2>
                <p className="mt-5 text-sm leading-7 text-ms-warm-white/58">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
