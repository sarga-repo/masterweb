"use client";

import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

type NewsletterCtaProps = {
  eyebrow?: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
  actionLabel?: string;
};

export function NewsletterCtaSection({
  eyebrow = "Stay in the race",
  title,
  description,
  cta,
  actionLabel = "Subscribe",
}: NewsletterCtaProps) {
  return (
    <section className="relative overflow-hidden border-y border-ms-warm-white/12 bg-ms-black">
      {/* Thermal gradient accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,#E8192C_30%,#FF6B00_50%,#F5C800_70%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-full w-[40%] bg-[radial-gradient(ellipse_at_left,#E8192C_0%,transparent_70%)] opacity-8"
      />

      <div className="ms-shell relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-center">
        {/* Left - copy */}
        <div>
          <span className="ms-kicker text-ms-ignition-orange">{eyebrow}</span>
          <h2 className="ms-display mt-6 max-w-[12ch] text-[clamp(2.25rem,5.25vw,5.25rem)]">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ms-warm-white/60">
            {description}
          </p>
        </div>

        {/* Right - action panel */}
        <div className="ms-panel bg-ms-graphite p-8 sm:p-10">
          <form
            action="#"
            method="post"
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <label
              htmlFor="newsletter-email"
              className="ms-data-label text-ms-warm-white/42"
            >
              Your email
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="racer@sarga.co"
              className="h-(--ms-control-height) w-full border border-ms-warm-white/18 bg-ms-black px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/30 focus:border-ms-apex-crimson focus:outline-none"
            />
            <button
              type="submit"
              className="group flex h-(--ms-control-height) items-center justify-between bg-ms-apex-crimson px-5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
            >
              {actionLabel}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {cta ? (
            <p className="mt-6 border-t border-ms-warm-white/10 pt-4 text-xs text-ms-warm-white/38">
              Or{" "}
              <Link
                href={cta.href}
                className="text-ms-slipstream-teal underline underline-offset-4 transition-colors hover:text-ms-warm-white"
              >
                {cta.label}
              </Link>
            </p>
          ) : null}

          <p className="mt-4 text-[0.65rem] leading-5 text-ms-warm-white/28">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
