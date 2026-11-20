import type { Metadata } from "next";
import Card from "@/components/Card";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Creează cont · CacheFlow",
};

export default function InregistrarePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-bold">Creează un cont</h1>
      <p className="text-muted mt-2">Durează un minut. Progresul tău se salvează în cont.</p>
      <Card className="mt-6">
        <RegisterForm />
      </Card>
    </main>
  );
}
