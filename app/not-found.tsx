import Link from "next/link";
import ErrorState from "@/components/ErrorState";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <ErrorState
        symbol="?"
        title="Pagina nu există"
        message="Poate linkul e greșit sau pagina a fost mutată."
      >
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-12 items-center justify-center rounded-xl px-5 font-semibold"
        >
          Mergi la Acasă
        </Link>
      </ErrorState>
    </main>
  );
}
