import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`border-border bg-surface rounded-xl border p-4 shadow-sm sm:p-6 ${className}`}
      {...props}
    />
  );
}
