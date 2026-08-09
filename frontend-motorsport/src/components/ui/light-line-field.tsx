export function LightLineField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <span className="ms-speed-line absolute left-0 top-[24%] h-px w-[42%] bg-gradient-to-r from-transparent via-ms-electric-yellow/45 to-transparent" />
      <span className="ms-speed-line-delay-1 absolute left-0 top-[52%] h-px w-[58%] bg-gradient-to-r from-transparent via-ms-ignition-orange/40 to-transparent" />
      <span className="ms-speed-line-delay-2 absolute left-0 top-[76%] h-px w-[36%] bg-gradient-to-r from-transparent via-ms-slipstream-teal/45 to-transparent" />
    </div>
  );
}
