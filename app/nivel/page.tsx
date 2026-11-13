import Link from "next/link";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";
import { LEVEL_BADGE, LEVELS } from "@/lib/levels";

export default function StudiuPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Studiu</h1>
      <p className="text-muted mt-2 text-sm">
        Parcurge nivelurile pe rând. Următorul se deschide după ce îl studiezi pe cel curent.
      </p>

      <ol className="mt-6 flex flex-col gap-3">
        {LEVELS.map((level) => {
          const badge = LEVEL_BADGE[level.state];
          const content = (
            <>
              <span className="flex items-center gap-2">
                {level.state === "locked" && <span aria-hidden="true">🔒</span>}
                <span>
                  <span className="text-muted block text-sm">Nivelul {level.id}</span>
                  <span className="block font-semibold">{level.name}</span>
                </span>
              </span>
              <StatusBadge status={badge.status} label={badge.label} />
            </>
          );

          return (
            <li key={level.id}>
              {level.state === "locked" ? (
                <Card
                  aria-disabled="true"
                  className="bg-locked-soft text-muted flex items-center justify-between gap-3"
                >
                  {content}
                </Card>
              ) : (
                <Link href={`/nivel/${level.id}`} className="block rounded-xl">
                  <Card className="hover:border-primary flex items-center justify-between gap-3">
                    {content}
                  </Card>
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <Link href="/" className="mt-6 inline-block underline">
        ← Înapoi
      </Link>
    </main>
  );
}
