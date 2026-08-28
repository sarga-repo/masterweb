import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { MarkdownContent } from "@/components/content/markdown-content";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { MerchandiseItem } from "@/types/design-system";

const AVAILABILITY_LABELS: Record<MerchandiseItem["availability"], string> = {
  comingSoon: "Coming soon",
  availableExternal: "Partner store",
  inquiryOnly: "Inquiry only",
};

export function MerchandiseCard({
  item,
  index,
}: {
  item: MerchandiseItem;
  index: number;
}) {
  const actionLabel =
    item.availability === "availableExternal"
      ? "Visit partner"
      : item.availability === "inquiryOnly"
        ? "Ask about availability"
        : "Release pending";
  const actionClassName =
    "mt-7 flex min-h-12 items-center justify-between border-t border-ms-warm-white/12 pt-5 text-[0.62rem] font-black uppercase tracking-[0.15em] text-ms-warm-white/58 transition-colors hover:text-ms-electric-yellow";

  return (
    <article className="group border-t border-ms-warm-white/16 pt-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-ms-charcoal">
        <ResilientImage
          src={item.image}
          alt={item.imageAlt}
          fallbackSrc={
            index % 2 === 0
              ? "/media/merchandise/sarga-team-tee.jpg"
              : "/media/merchandise/sarga-track-cap.jpg"
          }
          fallbackAlt="Sarga Motorsport merchandise preview"
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className="object-cover transition duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ms-black/75 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 border border-ms-warm-white/20 bg-ms-black/75 px-3 py-2 text-[0.56rem] font-black uppercase tracking-[0.14em]">
          {AVAILABILITY_LABELS[item.availability]}
        </span>
        <span className="absolute bottom-4 right-4 font-display text-xl text-ms-warm-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h2 className="ms-heading-card mt-6">{item.title}</h2>
      {item.description ? (
        <MarkdownContent
          value={item.description}
          className="ms-rich-text mt-4 text-sm leading-7 text-ms-warm-white/55"
        />
      ) : null}
      {item.priceLabel ? (
        <p className="ms-data-label mt-5 text-ms-ignition-orange">
          {item.priceLabel}
        </p>
      ) : null}
      {item.href ? (
        item.href.startsWith("http") ? (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={actionClassName}
          >
            {actionLabel}
            <ArrowUpRightIcon className="size-4" />
          </a>
        ) : (
          <Link href={item.href} className={actionClassName}>
            {actionLabel}
            <ArrowUpRightIcon className="size-4" />
          </Link>
        )
      ) : (
        <p className={`${actionClassName} pointer-events-none`}>
          {actionLabel}
          <span aria-hidden="true">-</span>
        </p>
      )}
    </article>
  );
}
