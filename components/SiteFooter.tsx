import Logo from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="text-muted mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 py-6 text-sm sm:flex-row sm:justify-between">
        <span className="text-foreground flex items-center gap-2 font-semibold">
          <Logo className="size-5" />
          CacheFlow
        </span>
        <span>© 2026 · Educație financiară pentru tineri</span>
      </div>
    </footer>
  );
}
