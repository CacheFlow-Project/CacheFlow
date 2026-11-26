import type { ReactNode } from "react";

type ErrorStateProps = {
  title: string;
  message: string;
  symbol?: string;
  headingLevel?: 1 | 2;
  children?: ReactNode;
};

export default function ErrorState({
  title,
  message,
  symbol = "!",
  headingLevel = 1,
  children,
}: ErrorStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h1";

  return (
    <div className="border-border bg-surface mx-auto flex max-w-md flex-col items-center rounded-2xl border p-6 text-center shadow-sm sm:p-8">
      <span
        aria-hidden="true"
        className="bg-wrong-soft text-wrong flex size-14 items-center justify-center rounded-full text-2xl font-extrabold"
      >
        {symbol}
      </span>
      <Heading className="mt-4 text-2xl font-extrabold tracking-tight">{title}</Heading>
      <p className="text-muted mt-2">{message}</p>
      {children && (
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
