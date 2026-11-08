import Link from "next/link";

export default function ChestionarPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">Chestionar</h1>
      <p className="mt-2 text-sm opacity-80">Ecran placeholder.</p>
      <Link href="/" className="mt-4 inline-block underline">
        ← Înapoi
      </Link>
    </main>
  );
}
