"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
  /** Reveal threshold (0–1). */
  threshold?: number;
};

/**
 * Progressive-enhancement scroll reveal. Content is fully visible for no-JS and
 * reduced-motion users; when JS + motion are available it fades/rises in on
 * first entry. The CSS hidden state only applies once this marks the document
 * root (see globals.css → `html[data-hs-reveal="on"] .hs-reveal`).
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-hs-reveal", "on");

    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`hs-reveal ${className}`.trim()}
      style={
        delay
          ? ({ "--hs-reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
