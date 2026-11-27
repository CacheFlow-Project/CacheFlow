"use client";

import { useOnlineStatus } from "@/lib/use-online-status";

export default function OfflineBanner() {
  const online = useOnlineStatus();

  // Zona „live” rămâne mereu pe pagină, ca cititoarele de ecran să anunțe schimbarea.
  return (
    <div role="status" aria-live="polite">
      {!online && (
        <p className="bg-here text-here-foreground px-4 py-2 text-center text-sm font-semibold">
          Nu ai conexiune la internet. Unele lucruri nu se vor încărca până revii online.
        </p>
      )}
    </div>
  );
}
