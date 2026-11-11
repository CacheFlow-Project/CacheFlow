export type Status = "locked" | "available" | "passed";

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

const statusStyles: Record<Status, { label: string; classes: string }> = {
  locked: { label: "Blocat", classes: "bg-locked-soft text-locked" },
  available: { label: "Disponibil", classes: "bg-primary-soft text-primary" },
  passed: { label: "Trecut", classes: "bg-correct-soft text-correct" },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { label, classes } = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${classes} ${className}`}
    >
      {label}
    </span>
  );
}
