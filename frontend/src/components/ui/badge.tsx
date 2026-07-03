import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "red" | "dark" | "light" | "gold";

const tones: Record<BadgeTone, string> = {
  red: "bg-sarga-red text-white",
  dark: "bg-sarga-black text-white",
  light: "bg-white/90 text-sarga-text",
  gold: "bg-sarga-gold text-sarga-black",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

/** Small uppercase pill label (e.g. "HOT TOPIC" on news cards). */
export function Badge({
  tone = "red",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sarga-pill px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
