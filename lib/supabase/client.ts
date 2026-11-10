import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pentru componente de browser (Client Components).
 * Citește configurarea din variabilele de mediu (.env.local).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
