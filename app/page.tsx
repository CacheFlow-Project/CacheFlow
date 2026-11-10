import Link from "next/link";

const screens = [
  { href: "/nivel", label: "Nivel" },
  { href: "/lectie", label: "Lecție" },
  { href: "/chestionar", label: "Chestionar" },
  { href: "/instrumente", label: "Instrumente" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">CacheFlow</h1>
      <p className="mt-2 text-sm opacity-80">Skill tree — alege un ecran:</p>
      <nav className="mt-4 flex flex-col gap-2">
        {screens.map((screen) => (
          <Link key={screen.href} href={screen.href} className="underline">
            {screen.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
