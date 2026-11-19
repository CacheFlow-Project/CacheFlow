import { CheckIcon, LockIcon } from "@/components/icons";

export type Status = "locked" | "available" | "passed";

type StatusBadgeProps = {
  status: Status;

  label?: string;
  className?: string;
};

const statusStyles: Record<Status, { label: string; classes: string }> = {
  locked: { label: "Blocat", classes: "bg-locked-soft text-locked" },
  available: { label: "Disponibil", classes: "bg-primary-soft text-primary" },
  passed: { label: "Trecut", classes: "bg-correct-soft text-correct" },
};

export default function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const { label: defaultLabel, classes } = statusStyles[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${classes} ${className}`}
    >
      {status === "locked" && <LockIcon className="size-3.5" />}
      {status === "passed" && <CheckIcon className="size-3.5" />}
      {status === "available" && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {label ?? defaultLabel}
    </span>
  );
}
