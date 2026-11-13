"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

// Câmpurile păstrează numele din formatul de conținut (#2).
export type Question = {
  intrebare: string;
  variante: string[];
  corecte: number[];
  explicatie: string;
};

type QuestionDemoProps = {
  questions: Question[];
};

// Demo în modul „practice”: feedback și explicație imediat după fiecare răspuns.
// Pentru testele de nivel și examen, răspunsurile corecte NU se trimit în browser (AGENTS.md §7).
export default function QuestionDemo({ questions }: QuestionDemoProps) {
  const [index, setIndex] = useState(0);

  const finished = index >= questions.length;
  const current = questions[index];
  const progress = (index / questions.length) * 100;

  return (
    <Card>
      <ProgressBar value={finished ? 100 : progress} label="Progres chestionar demo" />
      <p className="text-muted mt-2 text-sm">
        {finished
          ? "Ai parcurs toate întrebările."
          : `Întrebarea ${index + 1} din ${questions.length}`}
      </p>

      {finished ? (
        <Button className="mt-4 w-full" onClick={() => setIndex(0)}>
          Reia demo-ul
        </Button>
      ) : (
        <div className="mt-4">
          <QuestionCard
            key={index}
            mode="practice"
            question={current.intrebare}
            options={current.variante}
            correct={current.corecte}
            explanation={current.explicatie}
            onNext={() => setIndex((i) => i + 1)}
          />
        </div>
      )}
    </Card>
  );
}
