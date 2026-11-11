import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import content from "@/content/example.json";
import QuestionDemo from "./QuestionDemo";

export const metadata: Metadata = {
  title: "Demo design comun · CacheFlow",
};

const demoLevels: { name: string; status: Status }[] = [
  { name: "Nivelul 1", status: "passed" },
  { name: "Nivelul 2", status: "available" },
  { name: "Nivelul 3", status: "locked" },
  { name: "Nivelul 4", status: "locked" },
];

export default function DemoPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Demo design comun</h1>
      <p className="text-muted mt-2 text-sm">
        Componentele de bază din tichetul #3, cu date de exemplu.
      </p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Stările nivelurilor</h2>
        <Card className="mt-3">
          <ul className="flex flex-col gap-3">
            {demoLevels.map((level) => (
              <li key={level.name} className="flex items-center justify-between gap-3">
                <span>{level.name}</span>
                <StatusBadge status={level.status} />
              </li>
            ))}
          </ul>
          <ProgressBar className="mt-4" value={25} label="Progres total demo" />
          <p className="text-muted mt-2 text-sm">1 din 4 niveluri trecute</p>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Chestionar de exersare</h2>
        <div className="mt-3">
          <QuestionDemo questions={content.intrebari} />
        </div>
      </section>

      <Link href="/" className="mt-6 inline-block underline">
        ← Înapoi
      </Link>
    </main>
  );
}
