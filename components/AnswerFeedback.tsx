import { CheckIcon, XIcon } from "@/components/icons";

type AnswerFeedbackProps = {
  isCorrect: boolean;
  explanation?: string;
  className?: string;
};

export default function AnswerFeedback({
  isCorrect,
  explanation,
  className = "",
}: AnswerFeedbackProps) {
  const classes = isCorrect ? "border-correct bg-correct-soft" : "border-wrong bg-wrong-soft";
  const titleClass = isCorrect ? "text-correct" : "text-wrong";

  return (
    <div role="status" className={`flex gap-3 rounded-2xl border p-4 ${classes} ${className}`}>
      <span
        className={`bg-surface flex size-8 shrink-0 items-center justify-center rounded-full ${titleClass}`}
      >
        {isCorrect ? <CheckIcon className="size-4" /> : <XIcon className="size-4" />}
      </span>
      <div>
        <p className={`text-lg font-bold ${titleClass}`}>{isCorrect ? "Corect!" : "Greșit!"}</p>
        {explanation && <p className="text-foreground mt-1 text-base">{explanation}</p>}
      </div>
    </div>
  );
}
