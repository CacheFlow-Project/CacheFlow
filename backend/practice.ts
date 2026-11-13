"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAttempt, saveAnswer, finishAttempt } from "./attempts";

const PRACTICE_QUESTION_COUNT = 10;

/** Alege aleatoriu `count` elemente dintr-un array (amestecare Fisher-Yates). */
function pickRandom<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * Pornește exersarea pentru un nivel: creează o încercare `practice` și întoarce
 * 10 întrebări aleatorii din `questions_public` (fără răspunsurile corecte).
 */
export async function startPractice(levelId: number) {
  const { id: attemptId } = await createAttempt("practice", levelId);

  const supabase = await createClient();
  const { data: questions, error } = await supabase
    .from("questions_public")
    .select("id, question_text, options")
    .eq("level_id", levelId);

  if (error) {
    throw new Error(`Nu am putut încărca întrebările: ${error.message}`);
  }

  return {
    attemptId,
    questions: pickRandom(questions ?? [], PRACTICE_QUESTION_COUNT),
  };
}

/**
 * Verifică un răspuns în exersare. Reutilizează funcția comună `saveAnswer`, care
 * la `practice` întoarce imediat corect/greșit + răspunsurile corecte + explicația.
 */
export async function checkPracticeAnswer(
  attemptId: number,
  questionId: number,
  selected: number[],
) {
  return saveAnswer(attemptId, questionId, selected);
}

/**
 * Încheie exersarea: finalizează încercarea și marchează pasul de exersare ca
 * terminat pentru nivelul respectiv.
 */
export async function finishPractice(attemptId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Neautentificat.");
  }

  // Citim încercarea cu clientul de sesiune (RLS verifică proprietarul).
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("type, level_id")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Încercarea nu există sau nu îți aparține.");
  }
  if (attempt.type !== "practice") {
    throw new Error("Încercarea nu este de tip exersare.");
  }

  const result = await finishAttempt(attemptId, "completed");

  if (attempt.level_id != null) {
    await markPracticeDone(user.id, attempt.level_id as number);
  }

  return result;
}

/**
 * Marchează exersarea unui nivel ca terminată (în `level_progress`). Scrierea se
 * face prin service_role, ca progresul să nu poată fi falsificat din browser.
 */
async function markPracticeDone(userId: string, levelId: number) {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await admin.from("level_progress").upsert(
    {
      user_id: userId,
      level_id: levelId,
      practice_done_at: now,
      updated_at: now,
    },
    { onConflict: "user_id,level_id" },
  );

  if (error) {
    throw new Error(`Nu am putut marca exersarea ca terminată: ${error.message}`);
  }
}
