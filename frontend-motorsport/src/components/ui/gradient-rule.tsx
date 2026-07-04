type GradientRuleProps = {
  className?: string;
};

export function GradientRule({ className = "" }: GradientRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={`ms-animate-line block h-px w-full bg-gradient-to-r from-ms-apex-crimson via-ms-ignition-orange to-ms-electric-yellow ${className}`}
    />
  );
}
