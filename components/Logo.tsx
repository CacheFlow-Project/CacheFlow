type LogoProps = {
  className?: string;
};

export default function Logo({ className = "size-8" }: LogoProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`shrink-0 ${className}`}>
      <rect width="64" height="64" rx="16" className="fill-primary" />
      <path
        d="M42 20 A16 16 0 1 0 42 44"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-primary-foreground"
      />
      <circle cx="44" cy="32" r="6.5" className="fill-here" />
    </svg>
  );
}
