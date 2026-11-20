import BackLink from "@/components/BackLink";

export default function LectiePage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <BackLink href="/nivel/1" label="Nivelul 1" />
      <h1 className="mt-2 text-2xl font-bold">Lecție</h1>
      <p className="mt-2 text-sm opacity-80">Ecran placeholder</p>
    </main>
  );
}
