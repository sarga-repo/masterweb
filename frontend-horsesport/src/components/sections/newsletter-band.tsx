"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

type NewsletterBandProps = {
  title?: string;
  description?: string;
};

/**
 * Newsletter invite - bare content (no card/icon boxes). Left: editorial copy.
 * Right: a single ticket-capsule form (rounded input + red pill, joined).
 * Renders inside a section band supplied by the parent.
 */
export function NewsletterBand({
  title = "The Paddock Report",
  description = "Race calendars, stable stories, and hospitality invitations - delivered with editorial restraint.",
}: NewsletterBandProps) {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("success");
    e.currentTarget.reset();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-center lg:gap-16">
      <div>
        <span className="hs-kicker text-hs-orange">Stay close to the rail</span>
        <h3 className="hs-display mt-3 text-[clamp(1.5rem,3vw,2.4rem)] leading-[0.96] text-hs-cream">
          {title}
        </h3>
        <p className="hs-body mt-3 max-w-[34rem] text-hs-cream/50">
          {description}
        </p>
      </div>

      <div className="w-full lg:justify-self-end">
        {status === "success" ? (
          <div className="flex items-center gap-3 rounded-full border border-hs-cream/15 bg-hs-black/40 px-6 py-4 text-sm text-hs-cream/75">
            <span className="text-hs-orange">✓</span>
            Welcome to the paddock - first edition soon.
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 rounded-full border border-hs-cream/15 bg-hs-black/40 p-1.5 pl-6 transition-colors duration-300 focus-within:border-hs-orange/50"
          >
            <label htmlFor="nl-email" className="sr-only">
              Email address
            </label>
            <input
              id="nl-email"
              name="email"
              type="email"
              required
              placeholder="Your email address"
              className="min-w-0 flex-1 bg-transparent text-sm text-hs-cream placeholder:text-hs-cream/55 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-hs-red px-6 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-hs-white transition-colors duration-300 hover:bg-hs-orange"
            >
              Subscribe
              <ArrowRightIcon className="size-3.5" />
            </button>
          </form>
        )}
        <p className="mt-3 pl-2 text-[0.6rem] uppercase tracking-[0.14em] text-hs-cream/50">
          No spam · Unsubscribe anytime · Race-day alerts first
        </p>
      </div>
    </div>
  );
}
