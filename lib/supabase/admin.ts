import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase cu cheia `service_role`. OCOLEȘTE RLS.
 *
 * Se folosește DOAR în cod care rulează pe server (Server Actions din `backend/`),
 * niciodată în componente de browser. Cheia `SUPABASE_SERVICE_ROLE_KEY` nu are prefix
 * `NEXT_PUBLIC_`, deci nu ajunge niciodată în bundle-ul clientului.
 *
 * Rol concret: citirea coloanei `correct_answers` din `questions` (blocată de RLS
 * pentru utilizatorii obișnuiți), ca verificarea testului să se facă pe server.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Lipsesc NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY din mediu.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
