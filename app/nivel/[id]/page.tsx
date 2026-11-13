import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { LEVEL_BADGE, LEVELS, type LevelSteps, getLevel } from "@/lib/levels";

const STEPS: { key: keyof LevelSteps; title: string; href: string }[] = [
  { key: "lessons", title: "Lecții video", href: "/lectie" },
  { key: "practice", title: "Exersare", href: "/chestionar" },
  { key: "tool", title: "Instrument", href: "/instrumente" },
];

type NivelPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return LEVELS.map((level) => ({ id: String(level.id) }));
}

// Pagina se afișează imediat; doar partea care citește numărul nivelului din URL
// stă în <Suspense>, cum recomandă Next.js 16 pentru navigare instantanee.
export default function NivelPage({ params }: NivelPageProps) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <Suspense fallback={<p className="text-muted text-sm">Se încarcă nivelul…</p>}>
        <LevelContent params={params} />
      </Suspense>
      <Link href="/nivel" className="mt-6 inline-block underline">
        ← Înapoi la niveluri
      </Link>
    </main>
  );
}

async function LevelContent({ params }: NivelPageProps) {
  const { id } = await params;
  const level = getLevel(Number(id));
  if (!level) notFound();

  if (level.state === "locked") {
    return (
      <Card>
        <p className="font-semibold">🔒 Nivelul {level.id} este blocat</p>
        <p className="text-muted mt-2 text-sm">Se deschide după ce studiezi nivelul anterior.</p>
      </Card>
    );
  }

  const badge = LEVEL_BADGE[level.state];

  return (
    <>
      <p className="text-muted text-sm">Nivelul {level.id}</p>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{level.name}</h1>
        <StatusBadge status={badge.status} label={badge.label} />
      </div>

      {level.state === "studied" && (
        <div
          role="status"
          className="border-correct bg-correct-soft mt-4 rounded-xl border-l-4 p-4"
        >
          <p className="text-correct font-semibold">Nivel studiat!</p>
          <p className="mt-1">Nivelul următor și testul din Examen sunt acum disponibile.</p>
        </div>
      )}

      <ol className="mt-6 flex flex-col gap-3">
        {STEPS.map((step, index) => {
          const done = level.steps[step.key];
          // Pașii se deschid în ordine: un pas e disponibil dacă cel dinainte e gata.
          const unlocked = index === 0 || level.steps[STEPS[index - 1].key];
          const label = (
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-bold ${done ? "bg-correct-soft text-correct" : "bg-locked-soft text-locked"}`}
              >
                {done ? "✓" : unlocked ? index + 1 : "🔒"}
              </span>
              <span className="font-semibold">
                {index + 1}. {step.title}
              </span>
              <span className="sr-only">{done ? "(gata)" : unlocked ? "" : "(blocat)"}</span>
            </span>
          );

          return (
            <li key={step.key}>
              {unlocked ? (
                <Link href={step.href} className="block rounded-xl">
                  <Card className="hover:border-primary">{label}</Card>
                </Link>
              ) : (
                <Card aria-disabled="true" className="bg-locked-soft text-muted">
                  {label}
                </Card>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
