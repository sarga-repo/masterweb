import { LocaleLink as Link } from "@/components/i18n/locale-link";

type PlaceholderPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  note?: string;
};

export function PlaceholderPage({
  eyebrow = "Phase 1 route",
  title,
  description,
  note,
}: PlaceholderPageProps) {
  return (
    <section className="flex flex-1 items-center bg-sarga-light py-20 sm:py-28">
      <div className="site-container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-bold uppercase tracking-[-0.04em] text-sarga-black sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          {description}
        </p>
        {note ? (
          <p className="mt-6 max-w-2xl rounded-2xl border border-slate-300 bg-white p-5 text-sm leading-6 text-slate-600">
            {note}
          </p>
        ) : null}
        <Link
          className="mt-8 inline-flex font-bold uppercase tracking-wide text-sarga-red hover:underline"
          href="/"
        >
          ← Back to gateway
        </Link>
      </div>
    </section>
  );
}
