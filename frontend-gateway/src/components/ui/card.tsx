import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CardImage = {
  src: string;
  alt: string;
};

type CardLayout = "stacked" | "overlay";

type CardProps = {
  /** `stacked` = image on top with a content panel (news). `overlay` = content over a full-bleed image (ecosystem). */
  layout?: CardLayout;
  image?: CardImage;
  badge?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  ctaLabel?: string;
  className?: string;
};

/** Neutral gradient shown when no image asset is available yet. */
function ImagePlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-br from-sarga-soft via-sarga-dark to-sarga-black"
    />
  );
}

export function Card({
  layout = "stacked",
  image,
  badge,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  className,
}: CardProps) {
  if (layout === "overlay") {
    const inner = (
      <>
        <div className="absolute inset-0">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
          />
        </div>
        <div className="relative flex h-full flex-col p-6">
          {badge ? (
            <Badge className="self-start" tone="red">
              {badge}
            </Badge>
          ) : null}
          <div className="mt-auto pt-24">
            {eyebrow ? (
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-sarga-red">
                {eyebrow}
              </p>
            ) : null}
            <h3 className="mt-2 font-heading text-xl font-bold uppercase leading-tight tracking-[-0.01em] text-white">
              {title}
            </h3>
            {description ? (
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">
                {description}
              </p>
            ) : null}
            {href && ctaLabel ? (
              <span className="mt-5 inline-flex items-center gap-2 rounded-sarga-pill bg-sarga-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.04em] text-white transition-colors group-hover:bg-sarga-red-dark">
                {ctaLabel}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            ) : null}
          </div>
        </div>
      </>
    );

    const overlayClasses = cn(
      "group relative isolate flex min-h-80 overflow-hidden rounded-sarga-lg",
      href &&
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-sarga-orange",
      className,
    );

    return href ? (
      <Link href={href} className={overlayClasses}>
        {inner}
      </Link>
    ) : (
      <article className={overlayClasses}>{inner}</article>
    );
  }

  // stacked (news) layout
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-sarga-lg bg-sarga-light",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
        {badge ? (
          <Badge className="absolute right-4 top-4" tone="red">
            {badge}
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {eyebrow ? (
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-sarga-red">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-3 font-heading text-lg font-bold uppercase leading-snug tracking-[-0.01em] text-sarga-text">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-sarga-text-muted">
            {description}
          </p>
        ) : null}
        {href && ctaLabel ? (
          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-2 self-start rounded-sarga-pill bg-sarga-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.04em] !text-white transition-colors hover:bg-sarga-red-dark focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-sarga-orange"
          >
            {ctaLabel}
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
