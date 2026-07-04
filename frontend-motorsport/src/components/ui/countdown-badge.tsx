"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownBadgeProps = {
  targetDate: string | Date;
  completeLabel?: string;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(target: number): TimeLeft | null {
  const distance = target - Date.now();
  if (distance <= 0) return null;
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export function CountdownBadge({
  targetDate,
  completeLabel = "Event underway",
  className = "",
}: CountdownBadgeProps) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft(target));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (!Number.isFinite(target)) return null;

  return (
    <div
      className={`inline-flex border border-ms-warm-white/20 bg-ms-black/70 px-4 py-3 backdrop-blur-md ${className}`}
      aria-live="polite"
    >
      {timeLeft ? (
        <div className="flex gap-4" aria-label="Event countdown">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <span key={unit} className="flex min-w-9 flex-col">
              <strong className="font-display text-xl leading-none tabular-nums">
                {String(value).padStart(2, "0")}
              </strong>
              <span className="mt-1 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-ms-warm-white/50">
                {unit.slice(0, 3)}
              </span>
            </span>
          ))}
        </div>
      ) : (
        <span className="ms-kicker text-ms-electric-yellow">
          {completeLabel}
        </span>
      )}
    </div>
  );
}
