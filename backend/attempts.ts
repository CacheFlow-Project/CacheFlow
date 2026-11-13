"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isExactMatch } from "@/lib/questions";

type AttemptType = "practice" | "level_test" | "final_exam";
type EndedReason = "completed" | "timeout" | "max_mistakes";

const PASS_RATIO = 0.9;

// Numărul de întrebări pe test (regulă de produs), folosit ca TOTAL la calculul
// scorului — ca promovarea să nu poată fi obținută răspunzând la o singură întrebare.
// level_test: 10 întrebări, minimum 9/10 (AGENTS.md §7).
// final_exam: 20 întrebări (fluxul PO) — de confirmat cu PO-ul, nu e în AGENTS.md.
const TEST_QUESTION_COUNT: Record<"level_test" | "final_exam", number> = {
  level_test: 10,
  final_exam: 20,
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
 * Creează o încercare nouă (exersare / test de nivel / examen final).
 * La examenul final `level_id` este null.
 */
export async function createAttempt(type: AttemptType, levelId?: number) {
  const userId = await requireUserId();
  // Scrierile în tabelele de rezultate se fac doar de pe server (service_role),
  // ca userul să nu poată insera/modifica direct din browser. user_id vine din sesiune.
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("quiz_attempts")
    .insert({
      user_id: userId,
      type,
      level_id: type === "final_exam" ? null : (levelId ?? null),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Nu am putut crea încercarea: ${error.message}`);
  }
  return { id: data.id as number };
}

/**
 * Salvează răspunsul la o întrebare dintr-o încercare și dacă e corect
 * (evaluat pe server).
 *
 * - La `practice` întoarce feedback imediat: corect/greșit + răspunsurile corecte
 *   + explicația.
 * - La `level_test` / `final_exam` NU întoarce nimic despre corectitudine
 *   (feedbackul apare abia la `finishAttempt`).
 */
export async function saveAnswer(attemptId: number, questionId: number, selected: number[]) {
  const userId = await requireUserId();
  const supabase = await createClient();

  // 1. Încercarea trebuie să fie a userului (RLS) și NEîncheiată.
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("id, type, level_id, finished_at")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Încercarea nu există sau nu îți aparține.");
  }
  if (attempt.finished_at) {
    throw new Error("Încercarea este deja încheiată.");
  }

  // 2. Citim cheia de răspuns DOAR pe server (admin ocolește RLS pe `questions`).
  const admin = createAdminClient();
  const { data: question, error: questionError } = await admin
    .from("questions")
    .select("level_id, correct_answers, explanation")
    .eq("id", questionId)
    .single();

  if (questionError || !question) {
    throw new Error("Întrebarea nu există.");
  }

  // Întrebarea trebuie să aparțină nivelului încercării. Examenul final
  // (level_id null) acoperă toate nivelurile, deci acolo orice întrebare e validă.
  if (attempt.level_id != null && question.level_id !== attempt.level_id) {
    throw new Error("Întrebarea nu face parte din această încercare.");
  }

  const correct = (question.correct_answers as number[]) ?? [];
  // Eliminăm duplicatele din selecția clientului înainte de comparație.
  const uniqueSelected = [...new Set(selected)];
  const isCorrect = isExactMatch(uniqueSelected, correct);

  // 3. Salvăm răspunsul prin service_role (is_correct nu trebuie scris din browser).
  //    Proprietatea e deja verificată mai sus prin citirea încercării cu clientul de sesiune.
  const { error: answerError } = await admin.from("attempt_answers").upsert(
    {
      attempt_id: attemptId,
      question_id: questionId,
      selected: uniqueSelected,
      is_correct: isCorrect,
    },
    { onConflict: "attempt_id,question_id" },
  );

  if (answerError) {
    throw new Error(`Nu am putut salva răspunsul: ${answerError.message}`);
  }

  // 4. Dacă e greșit, îl adăugăm în „Întrebările mele greșite" fără duplicate
  //    pe o întrebare nerezolvată (indexul unic parțial e garda finală).
  if (!isCorrect) {
    const { data: existing } = await supabase
      .from("wrong_answers")
      .select("id")
      .eq("user_id", userId)
      .eq("question_id", questionId)
      .is("resolved_at", null)
      .maybeSingle();

    if (!existing) {
      const { error: wrongError } = await admin.from("wrong_answers").insert({
        user_id: userId,
        attempt_id: attemptId,
        question_id: questionId,
        given_answer: JSON.stringify(uniqueSelected),
      });
      if (wrongError) {
        throw new Error(`Nu am putut salva greșeala: ${wrongError.message}`);
      }
    }
  }

  // 5. Feedback doar la exersare.
  if (attempt.type === "practice") {
    return {
      isCorrect,
      correctAnswers: correct,
      explanation: (question.explanation as string | null) ?? null,
    };
  }
  return { saved: true as const };
}

/**
 * Încheie o încercare: calculează scorul, dacă a trecut (prag 90% la test/examen)
 * și motivul încheierii. O încercare încheiată nu mai poate fi modificată.
 */
export async function finishAttempt(attemptId: number, reason: EndedReason) {
  const userId = await requireUserId();
  const supabase = await createClient();

  // Citim încercarea cu clientul de sesiune — RLS garantează că e a userului.
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("id, type, finished_at")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Încercarea nu există sau nu îți aparține.");
  }
  if (attempt.finished_at) {
    throw new Error("Încercarea este deja încheiată.");
  }

  const { data: answers, error: answersError } = await supabase
    .from("attempt_answers")
    .select("is_correct")
    .eq("attempt_id", attemptId);

  if (answersError) {
    throw new Error(`Nu am putut calcula scorul: ${answersError.message}`);
  }

  const score = answers.filter((a) => a.is_correct).length;

  // Totalul este dimensiunea testului (nu doar câte întrebări s-a răspuns),
  // ca scorul să nu poată fi trecut răspunzând la o singură întrebare.
  let total: number;
  let passed: boolean | null;
  if (attempt.type === "level_test" || attempt.type === "final_exam") {
    const testType: "level_test" | "final_exam" = attempt.type;
    total = TEST_QUESTION_COUNT[testType];
    passed = reason === "completed" && score >= Math.ceil(PASS_RATIO * total);
  } else {
    // Exersarea nu are prag de promovare.
    total = answers.length;
    passed = null;
  }

  // Scrierea scorului se face prin service_role (score/passed nu trebuie scrise din
  // browser). `user_id` explicit, fiindcă service_role ocolește RLS.
  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from("quiz_attempts")
    .update({
      finished_at: new Date().toISOString(),
      ended_reason: reason,
      score,
      total_questions: total,
      passed,
    })
    .eq("id", attemptId)
    .eq("user_id", userId)
    .is("finished_at", null);

  if (updateError) {
    throw new Error(`Nu am putut încheia încercarea: ${updateError.message}`);
  }

  return { score, total, passed };
}
