import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { ArrowRightIcon, CheckIcon, LockIcon } from "@/components/icons";
import { LEVEL_BADGE, LEVELS, type LevelSteps } from "@/lib/levels";

const STEPS: { key: keyof LevelSteps; title: string; href: string }[] = [
  { key: "lessons", title: "Lecții video", href: "/lectie" },
  { key: "practice", title: "Exersare", href: "/chestionar" },
  { key: "tool", title: "Instrument", href: "/instrumente" },
];

export default function StudiuPage() {
  const studiedCount = LEVELS.filter((level) => level.state === "studied").length;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">Studiu</h1>
      <p className="text-muted mt-2">
        Nivelurile se deschid pe rând. Ai studiat {studiedCount} din {LEVELS.length}.
      </p>

      {/* Traseul: linia plină e drumul făcut, cea punctată e ce urmează. */}
      <ol className="mt-8">
        {LEVELS.map((level, index) => {
          const badge = LEVEL_BADGE[level.state];
          const isLast = index === LEVELS.length - 1;
          const isCurrent = level.state === "open";
          const nextStep = STEPS.find((step) => !level.steps[step.key]);

          return (
            <li key={level.id} className="relative flex gap-4 pb-6">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute top-11 -bottom-1 left-[1.125rem] border-l-2 ${level.state === "studied" ? "border-correct" : "border-border border-dashed"}`}
                />
              )}

              <span
                aria-hidden="true"
                className={`font-display relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  level.state === "studied"
                    ? "bg-correct text-surface"
                    : isCurrent
                      ? "bg-here text-here-foreground ring-here/25 ring-4"
                      : "border-border bg-background text-locked border-2"
                }`}
              >
                {level.state === "studied" ? (
                  <CheckIcon className="size-4" />
                ) : level.state === "locked" ? (
                  <LockIcon className="size-4" />
                ) : (
                  level.id
                )}
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-muted text-sm">
                  Nivelul {level.id}
                  {isCurrent && <span className="text-foreground font-semibold">, ești aici</span>}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {level.state === "locked" ? (
                    <h2 className="text-muted text-xl font-bold">{level.name}</h2>
                  ) : (
                    <Link
                      href={`/nivel/${level.id}`}
                      className="group inline-flex items-center gap-1.5 rounded-lg text-xl font-bold hover:underline"
                    >
                      {level.name}
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                  <StatusBadge status={badge.status} label={badge.label} />
                </div>
                {level.state === "locked" && (
                  <p className="text-muted mt-1 text-sm">
                    Se deschide după Nivelul {level.id - 1}.
                  </p>
                )}
                {level.state === "studied" && (
                  <p className="text-muted mt-1 text-sm">Studiat. Testul te așteaptă în Examen.</p>
                )}

                {/* Doar nivelul curent se desface în cei 3 pași. */}
                {isCurrent && (
                  <div className="border-border bg-surface mt-4 rounded-2xl border p-4 shadow-sm">
                    <ul className="flex flex-col gap-1">
                      {STEPS.map((step) => {
                        const done = level.steps[step.key];
                        const isNext = step === nextStep;
                        return (
                          <li
                            key={step.key}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${isNext ? "bg-tint" : ""}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex size-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-correct text-surface" : isNext ? "border-here border-2" : "border-border border-2"}`}
                            >
                              {done && <CheckIcon className="size-3.5" />}
                            </span>
                            <span
                              className={`flex-1 font-semibold ${!done && !isNext ? "text-muted" : ""}`}
                            >
                              {step.title}
                            </span>
                            <span className="text-muted text-xs">
                              {done ? "Gata" : isNext ? "Urmează" : "După pasul anterior"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {nextStep && (
                      <Link
                        href={nextStep.href}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition-all active:scale-[0.98]"
                      >
                        Continuă: {nextStep.title.toLowerCase()}
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
