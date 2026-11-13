import Link from "next/link";
import content from "@/content/example.json";
import PracticeQuiz from "./PracticeQuiz";

const LEVEL = 1;

export default function ChestionarPage() {
  const questions = content.intrebari.filter((question) => question.nivel === LEVEL);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Exersare – Nivelul {LEVEL}</h1>
      <p className="text-muted mt-2 text-sm">
        Răspunde la întrebări și vezi imediat explicația fiecărui răspuns.
      </p>
      <div className="mt-6">
        <PracticeQuiz questions={questions} />
      </div>
      <Link href="/" className="mt-6 inline-block underline">
        ← Înapoi
      </Link>
    </main>
  );
}
