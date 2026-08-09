type GradientRuleProps = {
  className?: string;
};

export function GradientRule({ className = "" }: GradientRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={`ms-animate-line block h-0.5 w-full bg-[linear-gradient(90deg,#E8192C_0%,#FF6B00_32%,#F5C800_54%,#00C4CC_76%,#0033A0_100%)] ${className}`}
    />
  );
}
