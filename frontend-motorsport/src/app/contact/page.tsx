"use client";

import { useCallback, useState } from "react";

import { PageHero, PageShell, SectionHeader } from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { FormFieldErrors } from "@/lib/validation";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "partnership", label: "Partnership / sponsorship" },
  { value: "media", label: "Media inquiry" },
  { value: "event-ticket", label: "Event / ticket support" },
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
    <PageShell>
      <PageHero
        kicker="Get in touch"
        kickerColor="orange"
        title="Contact"
        accent="teal"
        accentPosition="bottom-left"
        grain
        description="Partnership proposals, media requests, ticket support, or just a question about Sarga Motorsport. We read every message."
      />

      <section className="ms-section ms-shell">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          {/* Form */}
          <div>
            <SectionHeader
              eyebrow="Inquiry form"
              title="Send a signal."
              align="left"
            />

            {submitted ? (
              <div className="ms-panel mt-12 bg-ms-black p-10">
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
                  <div className="border border-ms-apex-crimson/40 bg-ms-apex-crimson/10 px-5 py-4 text-sm text-ms-apex-crimson">
                    {serverMessage}
                  </div>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="ms-data-label text-ms-warm-white/42">
                      Name
                    </span>
                    <input
                      name="name"
                      required
                      className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/18 bg-ms-black px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/30 focus:border-ms-apex-crimson focus:outline-none"
                      placeholder="Your name"
                    />
                    {errors.name ? (
                      <span className="mt-1 block text-xs text-ms-apex-crimson">
                        {errors.name}
                      </span>
                    ) : null}
                  </label>
                  <label className="block">
                    <span className="ms-data-label text-ms-warm-white/42">
                      Email
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/18 bg-ms-black px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/30 focus:border-ms-apex-crimson focus:outline-none"
                      placeholder="you@example.com"
                    />
                    {errors.email ? (
                      <span className="mt-1 block text-xs text-ms-apex-crimson">
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
                    name="category"
                    className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/18 bg-ms-black px-4 text-sm text-ms-warm-white focus:border-ms-apex-crimson focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category ? (
                    <span className="mt-1 block text-xs text-ms-apex-crimson">
                      {errors.category}
                    </span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="ms-data-label text-ms-warm-white/42">
                    Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="mt-2 w-full border border-ms-warm-white/18 bg-ms-black px-4 py-3 text-sm text-ms-warm-white placeholder:text-ms-warm-white/30 focus:border-ms-apex-crimson focus:outline-none"
                    placeholder="Tell us what you need (at least 20 characters)..."
                  />
                  {errors.message ? (
                    <span className="mt-1 block text-xs text-ms-apex-crimson">
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
          <aside className="ms-panel bg-ms-black p-8 self-start">
            <span className="ms-data-label text-ms-warm-white/42">
              Race control
            </span>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="ms-kicker text-ms-ignition-orange">General</h3>
                <p className="mt-2 text-sm text-ms-warm-white/60">
                  hello@sarga.co
                </p>
              </div>
              <div>
                <h3 className="ms-kicker text-ms-ignition-orange">
                  Partnerships
                </h3>
                <p className="mt-2 text-sm text-ms-warm-white/60">
                  partners@sarga.co
                </p>
              </div>
              <div>
                <h3 className="ms-kicker text-ms-ignition-orange">Media</h3>
                <p className="mt-2 text-sm text-ms-warm-white/60">
                  media@sarga.co
                </p>
              </div>
              <div>
                <h3 className="ms-kicker text-ms-ignition-orange">
                  Ticket support
                </h3>
                <p className="mt-2 text-sm text-ms-warm-white/60">
                  tickets@sarga.co
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
      </section>
    </PageShell>
  );
}
