"use client";

import { useState } from "react";
import AnswerFeedback from "@/components/AnswerFeedback";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";

export type Question = {
  intrebare: string;
  variante: string[];
  corecte: number[];
  explicatie: string;
};

type QuestionDemoProps = {
  questions: Question[];
};

// Demo în stil „Exersare”: feedback și explicație imediat după fiecare răspuns.
// Pentru testele de nivel și examen, răspunsurile corecte NU se trimit în browser (AGENTS.md §7).
export default function QuestionDemo({ questions }: QuestionDemoProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const finished = index >= questions.length;
  const current = questions[index];
  const progress = (index / questions.length) * 100;

  // Corect doar dacă setul bifat coincide exact cu setul de răspunsuri corecte.
  const isCorrect =
    current !== undefined &&
    selected.length === current.corecte.length &&
    current.corecte.every((position) => selected.includes(position));

  function toggleOption(position: number) {
    setSelected((previous) =>
      previous.includes(position)
        ? previous.filter((p) => p !== position)
        : [...previous, position],
    );
  }

  function goToNext() {
    setIndex((i) => i + 1);
    setSelected([]);
    setChecked(false);
  }

  function restart() {
    setIndex(0);
    setSelected([]);
    setChecked(false);
  }

  return (
    <Card>
      <ProgressBar value={finished ? 100 : progress} label="Progres chestionar demo" />
      <p className="text-muted mt-2 text-sm">
        {finished
          ? "Ai parcurs toate întrebările."
          : `Întrebarea ${index + 1} din ${questions.length}`}
      </p>

      {finished ? (
        <Button className="mt-4 w-full" onClick={restart}>
          Reia demo-ul
        </Button>
      ) : (
        <>
          <fieldset className="mt-4" disabled={checked}>
            <legend className="text-lg font-semibold">{current.intrebare}</legend>
            <p className="text-muted mt-1 text-sm">Bifează unul sau mai multe răspunsuri.</p>
            <div className="mt-3 flex flex-col gap-2">
              {current.variante.map((option, position) => (
                <label
                  key={option}
                  className="border-border flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2"
                >
                  <input
                    type="checkbox"
                    className="accent-primary size-5"
                    checked={selected.includes(position)}
                    onChange={() => toggleOption(position)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {checked ? (
            <>
              <AnswerFeedback
                className="mt-4"
                isCorrect={isCorrect}
                explanation={current.explicatie}
              />
              <Button className="mt-4 w-full" onClick={goToNext}>
                {index + 1 < questions.length ? "Următoarea întrebare" : "Vezi finalul"}
              </Button>
            </>
          ) : (
            <Button
              className="mt-4 w-full"
              disabled={selected.length === 0}
              onClick={() => setChecked(true)}
            >
              Verifică răspunsul
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
