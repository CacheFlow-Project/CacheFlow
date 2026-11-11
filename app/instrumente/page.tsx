import Link from "next/link";
import BudgetSimulator from "./BudgetSimulator";

export default function InstrumentePage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Simulatorul de buget lunar</h1>
      <p className="text-muted mt-2 text-sm">
        Completează venitul și cheltuielile ca să vezi dacă îți ajung banii.
      </p>
      <div className="mt-6">
        <BudgetSimulator />
      </div>
      <Link href="/" className="mt-6 inline-block underline">
        ← Înapoi
      </Link>
    </main>
  );
}
