"use client";

import { useState } from "react";
import { signOut } from "@/backend/auth";
import { LogoutIcon } from "@/components/icons";

// Butonul de deconectare din bara de sus (#53).
export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    setFailed(false);
    try {
      const result = await signOut();
      if (result.success) {
        // Reîncărcare completă intenționată: golește din browser paginile contului după deconectare.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/start");
        return;
      }
      setFailed(true);
    } catch {
      setFailed(true);
    }
    setPending(false);
  }

  return (
    <div className="flex items-center gap-2">
      {failed && (
        <span role="alert" className="text-wrong text-xs">
          Nu s-a putut deconecta. Încearcă din nou.
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="border-border text-muted hover:bg-tint hover:text-foreground inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors disabled:opacity-60"
      >
        <LogoutIcon className="size-4" />
        {pending ? "Se deconectează…" : "Deconectare"}
      </button>
    </div>
  );
}
