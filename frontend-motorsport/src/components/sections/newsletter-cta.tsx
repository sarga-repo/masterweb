"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

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
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "submitting" }
    | { type: "success" | "error"; message: string }
  >({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus({ type: "submitting" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          website: formData.get("website"),
          sourcePage: window.location.pathname,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message ?? "Subscription could not be completed.",
        );
      }

      form.reset();
      setStatus({
        type: "success",
        message: result.message ?? "You're on the grid. Watch your inbox.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Subscription could not be completed.",
      });
    }
  }

  return (
    <section className="relative overflow-hidden border-y border-ms-warm-white/12 bg-ms-black">
      {/* Thermal gradient accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#E8192C_0%,#FF6B00_32%,#F5C800_54%,#00C4CC_76%,#0033A0_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-full w-[40%] bg-[radial-gradient(ellipse_at_left,#E8192C_0%,transparent_70%)] opacity-8"
      />

      <div className="ms-shell relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-center">
        {/* Left - copy */}
        <div>
          <span className="ms-kicker text-ms-ignition-orange">{eyebrow}</span>
          <h2 className="ms-heading-section mt-6 max-w-[12ch]">{title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ms-warm-white/60">
            {description}
          </p>
        </div>

        {/* Right - action panel */}
        <div className="ms-panel bg-ms-graphite p-8 sm:p-10">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label
              htmlFor="newsletter-email"
              className="ms-data-label text-ms-warm-white/62"
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
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="newsletter-website">Website</label>
              <input
                id="newsletter-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={status.type === "submitting"}
              className="group flex h-(--ms-control-height) items-center justify-between bg-ms-apex-crimson px-5 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-ms-ignition-orange disabled:cursor-wait disabled:opacity-65"
            >
              {status.type === "submitting" ? "Joining the grid…" : actionLabel}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p
            aria-live="polite"
            className={`mt-4 min-h-5 text-xs ${
              status.type === "success"
                ? "text-ms-slipstream-teal"
                : status.type === "error"
                  ? "text-ms-apex-crimson"
                  : "text-transparent"
            }`}
          >
            {status.type === "success" || status.type === "error"
              ? status.message
              : "Subscription status"}
          </p>

          {cta ? (
            <p className="mt-6 border-t border-ms-warm-white/10 pt-4 text-xs text-ms-warm-white/62">
              Or{" "}
              <Link
                href={cta.href}
                className="underline underline-offset-4 transition-colors hover:text-ms-warm-white"
                style={{ color: "#00C4CC" }}
              >
                {cta.label}
              </Link>
            </p>
          ) : null}

          <p className="mt-4 text-[0.65rem] leading-5 text-ms-warm-white/58">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
