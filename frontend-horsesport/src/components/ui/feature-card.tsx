import type { SVGProps, ComponentType } from "react";

type FeatureCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
};

/**
 * Clean feature/capability card - a single glass surface with an inline brand
 * icon (no nested icon box), title, and body. Consistent with the refined
 * "no box-in-box" homepage language.
 */
export function FeatureCard({ icon: Icon, title, body }: FeatureCardProps) {
  return (
    <article className="hs-card-glass h-full p-6 sm:p-7">
      <Icon className="size-6 text-hs-orange" />
      <h3 className="hs-display mt-5 text-base text-hs-cream">{title}</h3>
      <p className="mt-2.5 text-[0.8rem] leading-6 text-hs-cream/55">{body}</p>
    </article>
  );
}
