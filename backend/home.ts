"use server";

import { createClient } from "@/lib/supabase/server";
import { getStudyTree } from "./levels";

export type HomeSummary = {
  /** Nivelul curent din Studiu (cel deschis), sau null dacă nu există. */
  currentLevel: { id: number; name: string } | null;
  /** Câte niveluri sunt studiate. */
  studiedCount: number;
  totalLevels: number;
  /** Câte teste de nivel sunt trecute (niveluri distincte). */
  testsPassedCount: number;
  /** Examenul final e disponibil (toate testele de nivel trecute). */
  finalExamAvailable: boolean;
  /** Examenul final e deja trecut. */
  finalExamPassed: boolean;
  /** Venitul lunii curente din „Bugetul meu", sau null dacă nu există încă. */
  monthlyIncome: number | null;
};

/**
 * Întoarce, într-o singură cerere, tot ce afișează ecranul Acasă: nivelul curent,
 * câte sunt studiate, câte teste sunt trecute, starea examenului final și venitul lunar.
 *
 * Reutilizează `getStudyTree` (#78) pentru starea nivelurilor. Datele vin din progresul
 * salvat (`level_progress`, `user_progress`, `quiz_attempts`).
 *
 * Notă: nu există încă un tabel de buget, deci `monthlyIncome` este `null` (ticketul
 * cere venitul „dacă există"). Se completează când apare persistența pentru „Bugetul meu".
 */
export async function getHomeSummary(): Promise<HomeSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Neautentificat.");
  }
  const userId = user.id;

  const [levels, passedTestsRes, finalExamRes] = await Promise.all([
    getStudyTree(),
    supabase
      .from("quiz_attempts")
      .select("level_id")
      .eq("user_id", userId)
      .eq("type", "level_test")
      .eq("passed", true),
    supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "final_exam")
      .eq("passed", true)
      .limit(1),
  ]);

  if (passedTestsRes.error) {
    throw new Error(`Nu am putut încărca testele: ${passedTestsRes.error.message}`);
  }
  if (finalExamRes.error) {
    throw new Error(`Nu am putut încărca examenul: ${finalExamRes.error.message}`);
  }

  const studiedCount = levels.filter((level) => level.state === "studied").length;
  const current = levels.find((level) => level.state === "open");

  // Teste de nivel trecute: niveluri distincte cu un test promovat.
  const passedLevelIds = new Set((passedTestsRes.data ?? []).map((row) => row.level_id as number));
  const testsPassedCount = passedLevelIds.size;

  const finalExamPassed = (finalExamRes.data ?? []).length > 0;
  const finalExamAvailable = levels.length > 0 && testsPassedCount === levels.length;

  return {
    currentLevel: current ? { id: current.id, name: current.name } : null,
    studiedCount,
    totalLevels: levels.length,
    testsPassedCount,
    finalExamAvailable,
    finalExamPassed,
    monthlyIncome: null,
  };
}
