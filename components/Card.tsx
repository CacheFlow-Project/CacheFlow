import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export default function Card({ className = "", interactive = false, ...props }: CardProps) {
  const hover = interactive ? "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md" : "";

  return (
    <div
      className={`border-border bg-surface rounded-2xl border p-5 shadow-sm transition-all duration-200 sm:p-6 ${hover} ${className}`}
      {...props}
    />
  );
}
