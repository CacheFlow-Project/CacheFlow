"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";
import { useOnlineStatus } from "@/lib/use-online-status";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const online = useOnlineStatus();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main role="alert" className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <ErrorState
        title={online ? "Ceva n-a mers bine" : "Nu ai conexiune la internet"}
        message={
          online
            ? "Nu am putut afișa pagina. Încearcă din nou, iar dacă problema continuă, revino puțin mai târziu."
            : "Verifică conexiunea la internet și încearcă din nou."
        }
      >
        <Button onClick={() => retry()}>Încearcă din nou</Button>
        <Link
          href="/"
          className="border-border bg-surface hover:bg-tint inline-flex min-h-12 items-center justify-center rounded-xl border px-5 font-semibold transition-colors"
        >
          Mergi la Acasă
        </Link>
      </ErrorState>
    </main>
  );
}
