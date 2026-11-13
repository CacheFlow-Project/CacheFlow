"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { isExactMatch } from "@/lib/questions";

// Câmpurile păstrează numele din formatul de conținut (#2).
export type PracticeQuestion = {
  intrebare: string;
  variante: string[];
  corecte: number[];
  explicatie: string;
};

type PracticeQuizProps = {
  questions: PracticeQuestion[];
};

export default function PracticeQuiz({ questions }: PracticeQuizProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const total = questions.length;
  const finished = index >= total;
  const current = questions[index];

  function handleSubmit(selected: number[]) {
    if (isExactMatch(selected, current.corecte)) setScore((s) => s + 1);
  }

  function restart() {
    setIndex(0);
    setScore(0);
  }

  if (total === 0) {
    return (
      <Card>
        <p>Nu există încă întrebări pentru acest nivel.</p>
      </Card>
    );
  }

  if (finished) {
    const allCorrect = score === total;
    return (
      <Card>
        <ProgressBar value={100} label="Progres exersare" />
        <p className="text-muted mt-6 text-sm">Scorul tău</p>
        <p className="text-3xl font-bold">
          {score}/{total}
        </p>
        <p className="mt-2">
          {allCorrect
            ? "Bravo! Ai răspuns corect la toate întrebările."
            : "Continuă să exersezi. Fiecare greșeală te ajută să înveți."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="secondary" onClick={restart}>
            Exersează din nou
          </Button>
          <Link
            href="/instrumente"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2 text-base font-semibold"
          >
            Continuă la instrument
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <ProgressBar value={(index / total) * 100} label="Progres exersare" />
      <p className="text-muted mt-2 text-sm">
        Întrebarea {index + 1} din {total}
      </p>
      <div className="mt-4">
        <QuestionCard
          key={index}
          mode="practice"
          question={current.intrebare}
          options={current.variante}
          correct={current.corecte}
          explanation={current.explicatie}
          onSubmit={handleSubmit}
          onNext={() => setIndex((i) => i + 1)}
        />
      </div>
    </Card>
  );
}
