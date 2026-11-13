"use client";

import { useState } from "react";
import AnswerFeedback from "@/components/AnswerFeedback";
import Button from "@/components/Button";
import { isExactMatch } from "@/lib/questions";

export type QuestionMode = "practice" | "test" | "review";

type QuestionCardProps = {
  /** Textul întrebării (câmpul `intrebare` din conținut). */
  question: string;
  /** Variantele de răspuns (câmpul `variante`). */
  options: string[];
  /**
   * practice – după „Trimite” arată corect/greșit, explicația și „Următoarea”.
   * test – după „Trimite” trece direct mai departe, fără feedback.
   * review – doar afișare: răspunsul dat, cel corect și explicația.
   */
  mode: QuestionMode;
  /** Pozițiile variantelor corecte. Necesare în practice și review; NU se trimit în modul test. */
  correct?: number[];
  /** Explicația răspunsului. Necesară în practice și review. */
  explanation?: string;
  /** Doar în review: variantele bifate de utilizator. */
  givenAnswer?: number[];
  /** Apelat la „Trimite”, cu pozițiile bifate (practice și test). */
  onSubmit?: (selected: number[]) => void;
  /** Doar în practice: apelat la „Următoarea”. */
  onNext?: () => void;
};

// Componenta își ține singură starea (ce e bifat, dacă s-a trimis).
// Pentru o întrebare nouă, ecranul o randează cu un `key` nou, ex. key={index}.
export default function QuestionCard({
  question,
  options,
  mode,
  correct = [],
  explanation,
  givenAnswer = [],
  onSubmit,
  onNext,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number[]>(mode === "review" ? givenAnswer : []);
  const [submitted, setSubmitted] = useState(mode === "review");

  const showResult = submitted && mode !== "test";
  const isCorrect = isExactMatch(selected, correct);

  function toggleOption(position: number) {
    setSelected((previous) =>
      previous.includes(position)
        ? previous.filter((p) => p !== position)
        : [...previous, position],
    );
  }

  function handleSubmit() {
    onSubmit?.(selected);
    if (mode === "practice") setSubmitted(true);
  }

  function optionClasses(position: number): string {
    if (!showResult) return "border-border";
    if (correct.includes(position)) return "border-correct bg-correct-soft";
    if (selected.includes(position)) return "border-wrong bg-wrong-soft";
    return "border-border";
  }

  function optionMark(position: number): string | null {
    if (!showResult) return null;
    if (correct.includes(position)) return "✓ Corect";
    if (selected.includes(position)) return "✗ Greșit";
    return null;
  }

  return (
    <div>
      <fieldset disabled={showResult}>
        <legend className="text-lg font-semibold">{question}</legend>
        <p className="text-muted mt-1 text-sm">Pot fi mai multe răspunsuri corecte.</p>

        <div className="mt-3 flex flex-col gap-2">
          {options.map((option, position) => {
            const mark = optionMark(position);
            return (
              <label
                key={option}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${optionClasses(position)}`}
              >
                <input
                  type="checkbox"
                  className="accent-primary size-5 shrink-0"
                  checked={selected.includes(position)}
                  onChange={() => toggleOption(position)}
                />
                <span className="flex-1">{option}</span>
                {mark && (
                  <span
                    className={`text-sm font-semibold ${correct.includes(position) ? "text-correct" : "text-wrong"}`}
                  >
                    {mark}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {showResult ? (
        <>
          <AnswerFeedback className="mt-4" isCorrect={isCorrect} explanation={explanation} />
          {mode === "practice" && (
            <Button className="mt-4 w-full" onClick={onNext}>
              Următoarea
            </Button>
          )}
        </>
      ) : (
        <Button className="mt-4 w-full" disabled={selected.length === 0} onClick={handleSubmit}>
          Trimite
        </Button>
      )}
    </div>
  );
}
