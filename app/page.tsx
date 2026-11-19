import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  ClipboardCheckIcon,
  WalletIcon,
} from "@/components/icons";
import { LEVELS, type LevelSteps } from "@/lib/levels";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const STEPS: { key: keyof LevelSteps; title: string; href: string; hint: string }[] = [
  { key: "lessons", title: "Lecții video", href: "/lectie", hint: "Urmează lecțiile video." },
  {
    key: "practice",
    title: "Exersare",
    href: "/chestionar",
    hint: "Ai văzut lecțiile. Urmează exersarea: răspunzi și vezi imediat explicația.",
  },
  {
    key: "tool",
    title: "Instrument",
    href: "/instrumente",
    hint: "Ai terminat exersarea. Urmează instrumentul, unde aplici ce ai învățat.",
  },
];

const SECTIONS: { title: string; status: string; Icon: Icon; href?: string }[] = [
  { title: "Studiu", status: "", Icon: BookIcon, href: "/nivel" },
  { title: "Examen", status: "În curând", Icon: ClipboardCheckIcon },
  { title: "Bugetul meu", status: "În curând", Icon: WalletIcon },
];

// Pagina de start provizorie (#52): rămâne până la ecranul Acasă din #62.
export default function Home() {
  const studiedCount = LEVELS.filter((level) => level.state === "studied").length;
  const current = LEVELS.find((level) => level.state === "open");
  const nextStep = current ? STEPS.find((step) => !current.steps[step.key]) : undefined;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Bun venit</h1>
      <p className="text-muted mt-2">
        Ai studiat {studiedCount} din {LEVELS.length} niveluri.
      </p>

      {/* Linia nivelurilor, ca stațiile unei linii de metrou (doar pe ecrane mari). */}
      <ol className="mt-8 hidden grid-cols-4 sm:grid">
        {LEVELS.map((level, index) => {
          const isCurrent = level.state === "open";
          return (
            <li key={level.id} className="relative">
              {index < LEVELS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-4 right-0 left-9 border-t-2 ${level.state === "studied" ? "border-correct" : "border-border border-dashed"}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`font-display relative flex size-8 items-center justify-center rounded-full text-sm font-extrabold ${
                  level.state === "studied"
                    ? "bg-correct text-surface"
                    : isCurrent
                      ? "bg-here text-here-foreground ring-here/25 ring-4"
                      : "border-border bg-background text-locked border-2"
                }`}
              >
                {level.state === "studied" ? <CheckIcon className="size-4" /> : level.id}
              </span>
              <p className="text-muted mt-3 text-xs">
                Nivelul {level.id}
                {isCurrent && ", ești aici"}
              </p>
              <p className="text-sm font-bold">{level.name}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {current && nextStep && (
          <section className="border-border border-l-here bg-surface rounded-2xl border border-l-[6px] p-6 shadow-sm sm:p-8">
            <p className="text-muted text-sm">Nivelul {current.id}</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">{current.name}</h2>
            <p className="mt-3 max-w-prose">{nextStep.hint}</p>
            <Link
              href={nextStep.href}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl px-6 font-semibold transition-all active:scale-[0.98]"
            >
              Continuă: {nextStep.title.toLowerCase()}
              <ArrowRightIcon className="size-4" />
            </Link>
          </section>
        )}

        <ul className="divide-border border-border bg-surface flex flex-col divide-y overflow-hidden rounded-2xl border shadow-sm">
          {SECTIONS.map(({ title, status, Icon, href }) => {
            const row = (
              <span className="flex items-center gap-4 p-4">
                <span className="bg-tint text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{title}</span>
                  {status && <span className="text-muted block text-sm">{status}</span>}
                </span>
                {href && <ArrowRightIcon className="text-muted size-4" />}
              </span>
            );
            return (
              <li key={title}>
                {href ? (
                  <Link href={href} className="hover:bg-tint block transition-colors">
                    {row}
                  </Link>
                ) : (
                  <div aria-disabled="true" className="opacity-70">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
