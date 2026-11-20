import { Suspense } from "react";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import {
  ArrowRightIcon,
  CalculatorIcon,
  CheckIcon,
  LockIcon,
  PlayIcon,
  TargetIcon,
} from "@/components/icons";
import { LEVEL_BADGE, LEVELS, type LevelSteps, getLevel } from "@/lib/levels";

const STEPS: {
  key: keyof LevelSteps;
  title: string;
  description: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    key: "lessons",
    title: "Lecții video",
    description: "Clipuri scurte despre tema nivelului.",
    href: "/lectie",
    Icon: PlayIcon,
  },
  {
    key: "practice",
    title: "Exersare",
    description: "Întrebări cu explicație după fiecare răspuns.",
    href: "/chestionar",
    Icon: TargetIcon,
  },
  {
    key: "tool",
    title: "Instrument",
    description: "Aplici ce ai învățat într-un simulator.",
    href: "/instrumente",
    Icon: CalculatorIcon,
  },
];

type NivelPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return LEVELS.map((level) => ({ id: String(level.id) }));
}

// Pagina se afișează imediat; doar partea care citește numărul nivelului din URL
// stă în <Suspense>, cum recomandă Next.js 16 pentru navigare instantanee.
export default function NivelPage({ params }: NivelPageProps) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <BackLink href="/nivel" label="Studiu" />
      <div className="mt-4">
        <Suspense fallback={<p className="text-muted text-sm">Se încarcă nivelul…</p>}>
          <LevelContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function LevelContent({ params }: NivelPageProps) {
  const { id } = await params;
  const level = getLevel(Number(id));
  if (!level) notFound();

  if (level.state === "locked") {
    return (
      <Card className="flex flex-col items-center py-10 text-center">
        <span className="bg-locked-soft text-locked flex size-14 items-center justify-center rounded-full">
          <LockIcon className="size-6" />
        </span>
        <p className="mt-4 text-lg font-semibold">Nivelul {level.id} este blocat</p>
        <p className="text-muted mt-1 text-sm">Se deschide după ce studiezi nivelul anterior.</p>
      </Card>
    );
  }

  const badge = LEVEL_BADGE[level.state];
  const doneCount = STEPS.filter((step) => level.steps[step.key]).length;

  return (
    <>
      <p className="text-primary text-xs font-semibold tracking-wide uppercase">
        Nivelul {level.id}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{level.name}</h1>
        <StatusBadge status={badge.status} label={badge.label} />
      </div>
      <p className="text-muted mt-2">
        {doneCount} din {STEPS.length} pași terminați
      </p>

      {level.state === "studied" && (
        <div
          role="status"
          className="border-correct bg-correct-soft mt-6 flex gap-3 rounded-2xl border p-4"
        >
          <span className="bg-surface text-correct flex size-8 shrink-0 items-center justify-center rounded-full">
            <CheckIcon className="size-4" />
          </span>
          <div>
            <p className="text-correct font-semibold">Nivel studiat!</p>
            <p className="mt-0.5">Nivelul următor și testul din Examen sunt acum disponibile.</p>
          </div>
        </div>
      )}

      <ol className="mt-6 flex flex-col gap-3">
        {STEPS.map(({ key, title, description, href, Icon }, index) => {
          const done = level.steps[key];
          // Pașii se deschid în ordine: un pas e disponibil dacă cel dinainte e gata.
          const unlocked = index === 0 || level.steps[STEPS[index - 1].key];
          const iconStyle = done
            ? "bg-correct-soft text-correct"
            : unlocked
              ? "bg-primary-soft text-primary"
              : "bg-locked-soft text-locked";

          const content = (
            <span className="flex items-center gap-4">
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}
              >
                {done ? (
                  <CheckIcon className="size-5" />
                ) : unlocked ? (
                  <Icon className="size-5" />
                ) : (
                  <LockIcon className="size-5" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-muted block text-xs font-semibold">Pasul {index + 1}</span>
                <span className="block font-semibold">{title}</span>
                <span className="text-muted block text-sm">{description}</span>
              </span>
              <span className="sr-only">{done ? "(gata)" : unlocked ? "" : "(blocat)"}</span>
              {unlocked && <ArrowRightIcon className="text-muted size-4 shrink-0" />}
            </span>
          );

          return (
            <li key={key}>
              {unlocked ? (
                <Link href={href} className="block rounded-2xl">
                  <Card interactive>{content}</Card>
                </Link>
              ) : (
                <Card aria-disabled="true" className="bg-locked-soft text-muted shadow-none">
                  {content}
                </Card>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
