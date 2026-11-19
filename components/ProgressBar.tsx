type ProgressBarProps = {
  /** Procentul parcurs; valorile din afara intervalului 0–100 sunt limitate. */
  value: number;
  /** Textul citit de cititoarele de ecran, ex. „Progres Nivelul 1”. */
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
      className={`bg-primary-soft h-2.5 w-full overflow-hidden rounded-full ${className}`}
    >
      <div
        className="bg-primary h-full rounded-full transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
