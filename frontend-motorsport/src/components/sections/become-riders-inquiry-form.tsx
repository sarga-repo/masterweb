"use client";

import { useCallback, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { FormFieldErrors } from "@/lib/validation";

export function BecomeRidersInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [startedAt] = useState(() => Date.now());

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrors({});
      setServerMessage(null);
      setSubmitting(true);

      const form = new FormData(event.currentTarget);
      const name = String(form.get("name") ?? "").trim();
      const email = String(form.get("email") ?? "").trim();
      const region = String(form.get("region") ?? "").trim();
      const experience = String(form.get("experience") ?? "").trim();
      const localErrors: FormFieldErrors = {};
      if (name.length < 2) localErrors.name = "Please enter your name.";
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        localErrors.email = "Please enter a valid email address.";
      }
      if (region.length < 2)
        localErrors.region = "Please enter your city or province.";
      if (experience.length < 20) {
        localErrors.message =
          "Please provide at least 20 characters of context.";
      }
      if (Object.keys(localErrors).length > 0) {
        setErrors(localErrors);
        setServerMessage("Please review the highlighted fields.");
        setSubmitting(false);
        return;
      }
      const message = `Region: ${region || "Not provided"}\n\nRacing experience and goals:\n${experience}`;
      const sourceLocale =
        window.location.pathname === "/id" ||
        window.location.pathname.startsWith("/id/")
          ? "id"
          : "en";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Sarga-Locale": sourceLocale,
          },
          body: JSON.stringify({
            name,
            email,
            category: "talent-program",
            message,
            website: form.get("website") ?? "",
            formStartedAt: startedAt,
            sourcePage: window.location.pathname,
            sourceLocale,
          }),
        });
        const result = (await response.json()) as {
          ok: boolean;
          message?: string;
          errors?: FormFieldErrors;
        };

        if (result.ok) {
          setSubmitted(true);
          setServerMessage(result.message ?? "Inquiry received.");
        } else {
          setErrors(result.errors ?? {});
          setServerMessage(result.message ?? "We could not send this inquiry.");
        }
      } catch {
        setServerMessage("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [startedAt],
  );

  if (submitted) {
    return (
      <div role="status" className="ms-blue-panel ms-panel p-8 sm:p-10">
        <p className="ms-kicker text-ms-electric-yellow">Inquiry received</p>
        <h2 className="ms-heading-feature mt-5">
          Your signal is with the team.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-ms-warm-white/66">
          {serverMessage}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0"
        aria-hidden="true"
      />

      {serverMessage ? (
        <div
          role="alert"
          className="border border-ms-apex-crimson/45 bg-[#071a3d]/88 px-5 py-4 text-sm text-ms-warm-white"
        >
          {serverMessage}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="ms-data-label text-ms-warm-white/52">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "ijtc-name-error" : undefined}
            className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/22 bg-[#071a3d]/88 px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
            placeholder="Your name"
          />
          {errors.name ? (
            <span
              id="ijtc-name-error"
              className="mt-2 block text-xs text-ms-warm-white"
            >
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="ms-data-label text-ms-warm-white/52">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "ijtc-email-error" : undefined}
            className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/22 bg-[#071a3d]/88 px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
            placeholder="you@example.com"
          />
          {errors.email ? (
            <span
              id="ijtc-email-error"
              className="mt-2 block text-xs text-ms-warm-white"
            >
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label className="block">
        <span className="ms-data-label text-ms-warm-white/52">Region</span>
        <input
          name="region"
          required
          aria-invalid={Boolean(errors.region)}
          aria-describedby={errors.region ? "ijtc-region-error" : undefined}
          className="mt-2 h-(--ms-control-height) w-full border border-ms-warm-white/22 bg-[#071a3d]/88 px-4 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
          placeholder="City / province"
        />
        {errors.region ? (
          <span
            id="ijtc-region-error"
            className="mt-2 block text-xs text-ms-warm-white"
          >
            {errors.region}
          </span>
        ) : null}
      </label>

      <label className="block">
        <span className="ms-data-label text-ms-warm-white/52">
          Racing experience and goals
        </span>
        <textarea
          name="experience"
          required
          rows={7}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "ijtc-message-error" : undefined}
          className="mt-2 w-full border border-ms-warm-white/22 bg-[#071a3d]/88 px-4 py-3 text-sm text-ms-warm-white placeholder:text-ms-warm-white/38 focus:border-ms-electric-yellow focus:outline-none"
          placeholder="Tell us about your riding background, competition experience, and what you want to develop."
        />
        {errors.message ? (
          <span
            id="ijtc-message-error"
            className="mt-2 block text-xs text-ms-warm-white"
          >
            {errors.message}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="group flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send rider inquiry"}
        {!submitting ? (
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        ) : null}
      </button>
    </form>
  );
}
