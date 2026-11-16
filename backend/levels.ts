"use server";

import { createClient } from "@/lib/supabase/server";
import type { Level } from "@/lib/levels";
import { computeStudyTree } from "@/lib/study-tree";
import { markStep } from "./level-progress";

type SessionClient = Awaited<ReturnType<typeof createClient>>;

/** Întoarce id-ul utilizatorului din sesiune. Niciodată din parametri de browser. */
async function requireUserId(supabase: SessionClient): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Neautentificat.");
  }
  return data.user.id;
}

/**
 * Starea tuturor nivelurilor pentru utilizatorul din sesiune: locked / open / studied
 * și pașii bifați (lecții, exersare, instrument).
 */
export async function getStudyTree(): Promise<Level[]> {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  const [levels, lessons, watched, progress] = await Promise.all([
    supabase.from("levels").select("id, title, position").order("position"),
    supabase.from("lessons").select("id, level_id"),
    supabase.from("user_progress").select("lesson_id").eq("user_id", userId).eq("completed", true),
    supabase
      .from("level_progress")
      .select("level_id, practice_done_at, tool_done_at, studied_at")
      .eq("user_id", userId),
  ]);

  const error = levels.error ?? lessons.error ?? watched.error ?? progress.error;
  if (error) {
    throw new Error(`Nu am putut încărca nivelurile: ${error.message}`);
  }

  return computeStudyTree(
    levels.data ?? [],
    lessons.data ?? [],
    new Set((watched.data ?? []).map((row) => row.lesson_id as number)),
    progress.data ?? [],
  );
}

/**
 * Marchează instrumentul nivelului ca folosit.
 * E Server Action (apelabilă din browser), pentru că instrumentul rulează în browser.
 */
export async function markToolDone(levelId: number) {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);
  return markStep(userId, "tool_done_at", levelId);
}
