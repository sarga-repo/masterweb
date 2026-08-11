"use client";

import { useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { localeFromPathname, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type NewsletterFormProps = {
  id: string;
  placeholder?: string;
  tone?: "dark" | "light";
  className?: string;
  showConsent?: boolean;
  locale?: Locale;
};

export function NewsletterForm({
  id,
  placeholder = "your@mail.com",
  tone = "dark",
  className,
  showConsent = false,
  locale: providedLocale,
}: NewsletterFormProps) {
  const pathname = usePathname();
  const locale = providedLocale ?? localeFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const isDark = tone === "dark";
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sarga-Locale": locale,
        },
        body: JSON.stringify({
          email: form.get("email"),
          consent: form.get("consent") === "on",
          website: form.get("website"),
          sourcePage: window.location.pathname,
          sourceLocale: locale,
          formStartedAt: startedAt.current ?? 0,
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };
      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.message ?? dictionary.form.invalidEmail);
        return;
      }
      formRef.current?.reset();
      startedAt.current = null;
      setStatus("success");
      setMessage(result.message ?? dictionary.form.subscribed);
    } catch {
      setStatus("error");
      setMessage(dictionary.form.unavailable);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        startedAt.current ??= Date.now();
      }}
      noValidate
      className={cn("max-w-sm", className)}
    >
      <label htmlFor={id} className="sr-only">
        {dictionary.form.emailAddress}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 border py-1.5 pl-5 pr-1.5",
          isDark
            ? "border-white/25 bg-white/5 focus-within:border-white/60"
            : "border-sarga-border bg-white focus-within:border-sarga-text",
        )}
      >
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent text-sm focus:outline-none",
            isDark
              ? "text-white placeholder:text-white/40"
              : "text-sarga-text placeholder:text-sarga-text-muted",
          )}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label={dictionary.form.subscribe}
          className="flex h-10 w-10 shrink-0 items-center justify-center bg-sarga-red text-white transition-[background-color,transform] duration-300 hover:translate-x-0.5 hover:bg-sarga-red-dark focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-sarga-orange disabled:cursor-wait disabled:opacity-60"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      {showConsent ? (
        <label
          className={cn(
            "mt-3 flex items-start gap-3 text-xs leading-5",
            isDark ? "text-white/55" : "text-sarga-text-muted",
          )}
        >
          <input
            name="consent"
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-sarga-red"
          />
          {dictionary.form.consent}
        </label>
      ) : null}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />
      <p
        aria-live="polite"
        className={cn(
          "mt-3 min-h-5 text-xs font-semibold",
          status === "success"
            ? isDark
              ? "text-emerald-300"
              : "text-emerald-700"
            : isDark
              ? "text-sarga-orange"
              : "text-sarga-red",
        )}
      >
        {status === "submitting" ? dictionary.form.subscribing : message}
      </p>
    </form>
  );
}
