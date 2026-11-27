"use client";

import ErrorState from "@/components/ErrorState";
import "./globals.css";

export default function GlobalError() {
  return (
    <html lang="ro">
      <body className="flex min-h-screen items-center justify-center px-4">
        <main role="alert" className="w-full">
          <ErrorState
            title="Aplicația nu a putut porni"
            message="A apărut o problemă neașteptată. Reîncarcă pagina, iar dacă problema continuă, revino puțin mai târziu."
          >
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold"
            >
              Reîncarcă pagina
            </button>
          </ErrorState>
        </main>
      </body>
    </html>
  );
}
