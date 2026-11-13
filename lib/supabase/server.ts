import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pentru cod care rulează pe server (Server Components,
 * Server Actions, Route Handlers). `cookies()` este async în Next.js 16.
 * Citește configurarea din variabilele de mediu (.env.local).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Apelat dintr-un Server Component — se poate ignora dacă
            // sesiunea e reîmprospătată în proxy.ts (middleware). Vezi #44.
          }
        },
      },
    },
  );
}
