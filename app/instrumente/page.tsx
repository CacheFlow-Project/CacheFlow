import BackLink from "@/components/BackLink";
import BudgetSimulator from "./BudgetSimulator";

export default function InstrumentePage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <BackLink href="/nivel/1" label="Nivelul 1" />
      <h1 className="mt-2 text-2xl font-bold">Simulatorul de buget lunar</h1>
      <p className="text-muted mt-2 text-sm">
        Completează venitul și cheltuielile ca să vezi dacă îți ajung banii.
      </p>
      <div className="mt-6">
        <BudgetSimulator />
      </div>
    </main>
  );
}
