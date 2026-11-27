"use server";

import { createClient } from "@/lib/supabase/server";
import { getStudyTree } from "./levels";

export type ExamItemState = "locked" | "available" | "passed";

export type LevelTestOverview = {
  levelId: number;
  levelName: string;
  state: ExamItemState;
  /** Cel mai bun scor dintr-o încercare terminată a testului, sau null dacă nu există. */
  bestScore: number | null;
  /** Totalul întrebărilor din încercarea cu cel mai bun scor (ex. 10), sau null. */
  bestTotal: number | null;
  /** Câte încercări terminate are testul acestui nivel. */
  attempts: number;
  /** De ce e blocat testul (pentru UI), sau null dacă nu e blocat. */
  lockedReason: string | null;
};

export type FinalExamOverview = {
  state: ExamItemState;
  bestScore: number | null;
  bestTotal: number | null;
  attempts: number;
  lockedReason: string | null;
  /** Testele de nivel încă netrecute (motivul blocării examenului final). Gol dacă e disponibil/trecut. */
  pendingTests: { levelId: number; levelName: string }[];
};

export type ExamOverview = {
  levelTests: LevelTestOverview[];
  finalExam: FinalExamOverview;
};

type AttemptRow = {
  type: string;
  level_id: number | null;
  score: number | null;
  total_questions: number | null;
  passed: boolean | null;
  finished_at: string | null;
};

/** Agregă încercările TERMINATE de un anumit tip: dacă vreuna e trecută, cel mai bun scor și numărul lor. */
function summarize(attempts: AttemptRow[]) {
  let passed = false;
  let bestScore: number | null = null;
  let bestTotal: number | null = null;
  let count = 0;

  for (const attempt of attempts) {
    if (attempt.finished_at == null) continue; // doar încercările terminate contează ca „încercare".
    count += 1;
    if (attempt.passed === true) passed = true;
    const score = attempt.score ?? 0;
    if (bestScore === null || score > bestScore) {
      bestScore = score;
      bestTotal = attempt.total_questions ?? null;
    }
  }

  return { passed, bestScore, bestTotal, count };
}

/**
 * Starea secțiunii Examen pentru utilizatorul din sesiune (#84):
 * pentru fiecare nivel testul e `locked` (nivel nestudiat) / `available` / `passed`
 * (+ cel mai bun scor și numărul de încercări), iar examenul final e
 * `locked` (cu lista testelor netrecute) / `available` / `passed`.
 *
 * Reguli (story #63): testul unui nivel devine disponibil după ce nivelul e studiat;
 * examenul final devine disponibil după ce sunt trecute toate testele de nivel.
 *
 * Citire cu clientul de sesiune: RLS permite citirea propriilor niveluri și încercări.
 */
export async function getExamOverview(): Promise<ExamOverview> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Neautentificat.");
  }
  const userId = user.id;

  const [levels, attemptsRes] = await Promise.all([
    getStudyTree(),
    supabase
      .from("quiz_attempts")
      .select("type, level_id, score, total_questions, passed, finished_at")
      .eq("user_id", userId)
      .in("type", ["level_test", "final_exam"]),
  ]);

  if (attemptsRes.error) {
    throw new Error(`Nu am putut încărca încercările: ${attemptsRes.error.message}`);
  }
  const attempts = (attemptsRes.data ?? []) as AttemptRow[];

  // Grupăm încercările de test de nivel pe level_id.
  const levelTestAttempts = new Map<number, AttemptRow[]>();
  const finalExamAttempts: AttemptRow[] = [];
  for (const attempt of attempts) {
    if (attempt.type === "final_exam") {
      finalExamAttempts.push(attempt);
    } else if (attempt.type === "level_test" && attempt.level_id != null) {
      const list = levelTestAttempts.get(attempt.level_id) ?? [];
      list.push(attempt);
      levelTestAttempts.set(attempt.level_id, list);
    }
  }

  const levelTests: LevelTestOverview[] = levels.map((level) => {
    const summary = summarize(levelTestAttempts.get(level.id) ?? []);
    const studied = level.state === "studied";

    let state: ExamItemState;
    let lockedReason: string | null = null;
    if (summary.passed) {
      state = "passed";
    } else if (studied) {
      state = "available";
    } else {
      state = "locked";
      lockedReason = `Testul se deblochează după ce studiezi nivelul „${level.name}”.`;
    }

    return {
      levelId: level.id,
      levelName: level.name,
      state,
      bestScore: summary.bestScore,
      bestTotal: summary.bestTotal,
      attempts: summary.count,
      lockedReason,
    };
  });

  // Examenul final: disponibil după ce TOATE testele de nivel sunt trecute.
  const pendingTests = levelTests
    .filter((test) => test.state !== "passed")
    .map((test) => ({ levelId: test.levelId, levelName: test.levelName }));

  const finalSummary = summarize(finalExamAttempts);
  let finalState: ExamItemState;
  let finalLockedReason: string | null = null;
  if (finalSummary.passed) {
    finalState = "passed";
  } else if (levelTests.length > 0 && pendingTests.length === 0) {
    finalState = "available";
  } else {
    finalState = "locked";
    finalLockedReason = "Examenul final se deblochează după ce treci toate testele de nivel.";
  }

  const finalExam: FinalExamOverview = {
    state: finalState,
    bestScore: finalSummary.bestScore,
    bestTotal: finalSummary.bestTotal,
    attempts: finalSummary.count,
    lockedReason: finalLockedReason,
    pendingTests: finalState === "locked" ? pendingTests : [],
  };

  return { levelTests, finalExam };
}
