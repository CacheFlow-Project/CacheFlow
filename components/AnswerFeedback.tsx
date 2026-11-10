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
    <div role="status" className={`rounded-xl border-l-4 p-4 ${classes} ${className}`}>
      <p className={`text-lg font-bold ${titleClass}`}>{isCorrect ? "Corect!" : "Greșit!"}</p>
      {explanation && <p className="text-foreground mt-1 text-base">{explanation}</p>}
    </div>
  );
}
