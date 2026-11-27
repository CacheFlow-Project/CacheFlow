import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "Bun venit · CacheFlow",
};

const LINK_CLASSES =
  "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 py-2 text-base font-semibold transition-colors";

// Ecranul de start (#53): cine nu e logat ajunge aici și alege între login și înregistrare.
export default function StartPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-bold">Bun venit în CacheFlow</h1>
      <p className="text-muted mt-2">
        Învață să-ți gestionezi banii pas cu pas: lecții scurte, exerciții și instrumente.
      </p>

      <Card className="mt-8 flex flex-col gap-3">
        <Link
          href="/login"
          className={`${LINK_CLASSES} bg-primary text-primary-foreground hover:bg-primary/90`}
        >
          Am cont
        </Link>
        <Link
          href="/inregistrare"
          className={`${LINK_CLASSES} border-border bg-surface text-foreground hover:bg-locked-soft border`}
        >
          Sunt nou
        </Link>
      </Card>
    </main>
  );
}
