"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import {
  InformationBand,
  PageHero,
  PageShell,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { FormFieldErrors } from "@/lib/validation";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "partnership", label: "Partnership / sponsorship" },
  { value: "media", label: "Media inquiry" },
  { value: "event-ticket", label: "Event / ticket support" },
  { value: "talent-program", label: "IJTC / Become Riders" },
  { value: "merchandise", label: "Merchandise inquiry" },
  { value: "vendor", label: "Vendor inquiry" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [startedAt] = useState(() => Date.now());

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});
      setServerMessage(null);
      setSubmitting(true);

      const fd = new FormData(e.currentTarget);
      const payload = {
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        category: fd.get("category") as string,
        message: fd.get("message") as string,
        website: (fd.get("website") as string) ?? "",
        formStartedAt: startedAt,
        sourcePage: window.location.pathname,
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as {
          ok: boolean;
          message?: string;
          errors?: FormFieldErrors;
        };

        if (json.ok) {
          setSubmitted(true);
          setServerMessage(json.message ?? "Message received.");
        } else {
          if (json.errors) setErrors(json.errors);
          setServerMessage(json.message ?? "Something went wrong.");
        }
      } catch {
        setServerMessage("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [startedAt],
  );

  return (
    <PageShell spectrumSeparators>
      <PageHero
        kicker="Get in touch"
        kickerColor="orange"
        title="Contact"
        backgroundImage="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
        backgroundAlt="Sarga Motorsport driver and paddock team preparing in warm daylight"
        accent="teal"
        accentPosition="bottom-left"
        grain
        speedLines
        surface="heat"
        description="Partnership proposals, media requests, ticket support, or just a question about Sarga Motorsport. We read every message."
      />

      <InformationBand
        eyebrow="Inquiry control / Direct routing"
        title="One form. The right team."
        description="Choose the closest inquiry type and the message is routed to the Motorsport team responsible for it."
        items={[
          { label: "Channels", value: "07" },
          { label: "Accounts", value: "None" },
          { label: "Reply", value: "Email" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            {/* Form */}
            <div>
              <SectionHeader
                eyebrow="Inquiry form"
                title="Send a signal."
                align="left"
              />

              {submitted ? (
                <div className="ms-blue-panel ms-panel mt-12 p-10">
                  <span className="ms-kicker text-ms-electric-yellow">
                    Message received
                  </span>
                  <p className="mt-4 text-lg text-ms-warm-white/70">
                    {serverMessage ??
                      "Thank you for reaching out. Our team will respond within 2 business days."}
                  </p>
                </div>
              ) : (
                <form
                  className="mt-12 space-y-6"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Honeypot - invisible to real users */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] opacity-0"
                    aria-hidden="true"
                  />

                  {/* Server error banner */}
                  {serverMessage && !submitted ? (
                    <div
                      role="alert"
                      className="border border-ms-apex-crimson/40 bg-ms-apex-crimson/10 px-5 py-4 text-sm text-ms-warm-white"
                    >
                      {serverMessage}
                    </div>
                  ) : null}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="ms-data-label text-ms-warm-white/42">
                        Name
                      </span>
                      <input
                        id="contact-name"
                        name="name"
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? "contact-name-error" : undefined
                        }
                        className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/22 bg-[#071a3d]/85 px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
                        placeholder="Your name"
                      />
                      {errors.name ? (
                        <span
                          id="contact-name-error"
                          className="mt-1 block text-xs text-ms-warm-white"
                        >
                          {errors.name}
                        </span>
                      ) : null}
                    </label>
                    <label className="block">
                      <span className="ms-data-label text-ms-warm-white/42">
                        Email
                      </span>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "contact-email-error" : undefined
                        }
                        className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/22 bg-[#071a3d]/85 px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
                        placeholder="you@example.com"
                      />
                      {errors.email ? (
                        <span
                          id="contact-email-error"
                          className="mt-1 block text-xs text-ms-warm-white"
                        >
                          {errors.email}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <label className="block">
                    <span className="ms-data-label text-ms-warm-white/42">
                      Inquiry category
                    </span>
                    <select
                      id="contact-category"
                      name="category"
                      aria-invalid={Boolean(errors.category)}
                      aria-describedby={
                        errors.category ? "contact-category-error" : undefined
                      }
                      className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/22 bg-[#071a3d]/85 px-4 text-sm text-ms-warm-white focus:border-ms-electric-yellow focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category ? (
                      <span
                        id="contact-category-error"
                        className="mt-1 block text-xs text-ms-warm-white"
                      >
                        {errors.category}
                      </span>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="ms-data-label text-ms-warm-white/42">
                      Message
                    </span>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={6}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "contact-message-error" : undefined
                      }
                      className="mt-2 w-full border border-ms-warm-white/22 bg-[#071a3d]/85 px-4 py-3 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
                      placeholder="Tell us what you need (at least 20 characters)..."
                    />
                    {errors.message ? (
                      <span
                        id="contact-message-error"
                        className="mt-1 block text-xs text-ms-warm-white"
                      >
                        {errors.message}
                      </span>
                    ) : null}
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange disabled:opacity-50 disabled:hover:bg-ms-apex-crimson"
                  >
                    {submitting ? "Sending…" : "Send message"}
                    {!submitting ? (
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    ) : null}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar info */}
            <aside className="ms-blue-panel ms-panel self-start p-8">
              <span className="ms-data-label text-ms-warm-white/42">
                Race control
              </span>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="ms-kicker text-ms-ignition-orange">General</h3>
                  <p className="mt-2 text-sm text-ms-warm-white/60">
                    <a
                      className="hover:text-ms-electric-yellow"
                      href="mailto:hello@sarga.co"
                    >
                      hello@sarga.co
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="ms-kicker text-ms-ignition-orange">
                    Partnerships
                  </h3>
                  <p className="mt-2 text-sm text-ms-warm-white/60">
                    <a
                      className="hover:text-ms-electric-yellow"
                      href="mailto:partners@sarga.co"
                    >
                      partners@sarga.co
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="ms-kicker text-ms-ignition-orange">Media</h3>
                  <p className="mt-2 text-sm text-ms-warm-white/60">
                    <a
                      className="hover:text-ms-electric-yellow"
                      href="mailto:media@sarga.co"
                    >
                      media@sarga.co
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="ms-kicker text-ms-ignition-orange">
                    Ticket support
                  </h3>
                  <p className="mt-2 text-sm text-ms-warm-white/60">
                    <a
                      className="hover:text-ms-electric-yellow"
                      href="mailto:tickets@sarga.co"
                    >
                      tickets@sarga.co
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="ms-kicker text-ms-ignition-orange">
                    Talent programme
                  </h3>
                  <p className="mt-2 text-sm text-ms-warm-white/60">
                    Select IJTC / Become Riders in the form
                  </p>
                </div>
              </div>
              <div className="mt-10 border-t border-ms-warm-white/12 pt-6">
                <p className="text-[0.65rem] leading-5 text-ms-warm-white/30">
                  Sarga Motorsport does not operate public user accounts. All
                  inquiries are handled via email.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="ms-blue-heat-surface py-12 sm:py-16">
        <div className="ms-shell grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="ms-data-label text-ms-slipstream-teal">
              Race-day route
            </p>
            <h2 className="ms-heading-feature mt-4 max-w-[18ch]">
              Looking for an event or ticket answer?
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/events"
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              Browse events
            </Link>
            <Link
              href="/tickets"
              className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              Ticket support
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
