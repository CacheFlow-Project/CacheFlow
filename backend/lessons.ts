"use server";

import { createClient } from "@/lib/supabase/server";
import { markLessonCompleted } from "./level-progress";

export type LessonForLevel = {
  id: number;
  title: string;
  position: number;
  /** Linkul clipului. Poate fi null dacă nu a fost completat încă. */
  video_url: string | null;
  /** Durata clipului în secunde. */
  duration_sec: number;
  /** Dacă utilizatorul din sesiune a marcat lecția ca vizionată. */
  watched: boolean;
};

/** Întoarce id-ul utilizatorului din sesiune. Niciodată din parametri de browser. */
async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Neautentificat.");
  }
  return data.user.id;
}

/**
 * Lecțiile unui nivel, în ordine, cu video_url, durată și dacă sunt vizionate (#77).
 * Citirea se face cu clientul de sesiune: RLS permite citirea lecțiilor și a propriului progres.
 * Listarea nu se blochează pentru un nivel blocat — doar marcarea e restricționată.
 */
export async function getLessons(levelId: number): Promise<LessonForLevel[]> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const [lessonsRes, watchedRes] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, title, position, video_url, duration_sec")
      .eq("level_id", levelId)
      .order("position"),
    supabase.from("user_progress").select("lesson_id").eq("user_id", userId).eq("completed", true),
  ]);

  if (lessonsRes.error) {
    throw new Error(`Nu am putut încărca lecțiile: ${lessonsRes.error.message}`);
  }
  if (watchedRes.error) {
    throw new Error(`Nu am putut încărca progresul: ${watchedRes.error.message}`);
  }

  const watched = new Set((watchedRes.data ?? []).map((row) => row.lesson_id as number));

  return (lessonsRes.data ?? []).map((lesson) => ({
    id: lesson.id as number,
    title: lesson.title as string,
    position: lesson.position as number,
    video_url: (lesson.video_url as string | null) ?? null,
    duration_sec: (lesson.duration_sec as number) ?? 0,
    watched: watched.has(lesson.id as number),
  }));
}

/**
 * Marchează o lecție ca vizionată (upsert în `user_progress`) și recalculează starea nivelului (#77).
 * Nu se pot marca lecții dintr-un nivel blocat; marcarea repetată nu creează duplicate.
 */
export async function markLessonWatched(lessonId: number) {
  const userId = await requireUserId();
  return markLessonCompleted(userId, lessonId);
}
