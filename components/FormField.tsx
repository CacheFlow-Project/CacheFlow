import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  /** Mesajul de eroare afișat sub câmp; lipsă = câmpul e valid. */
  error?: string;
};

// Câmp de formular cu etichetă și mesaj de eroare legat de input (accesibil).
export default function FormField({ id, label, error, className = "", ...props }: FormFieldProps) {
  const errorId = `${id}-eroare`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`bg-background min-h-11 w-full rounded-lg border px-3 py-2 text-base ${error ? "border-wrong" : "border-border"} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-wrong text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
