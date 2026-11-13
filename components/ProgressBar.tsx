type ProgressBarProps = {
  value: number;
  label: string;
  className?: string;
};

export default function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const percent = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={`bg-locked-soft h-2 w-full overflow-hidden rounded-full ${className}`}
    >
      <div
        className="bg-primary h-full rounded-full transition-[width] duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
