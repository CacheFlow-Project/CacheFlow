"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Level } from "@/lib/levels";
import { computeStudyTree } from "@/lib/study-tree";

type StepColumn = "practice_done_at" | "tool_done_at";
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
 * Un nivel e blocat dacă nivelul dinaintea lui (după `position`) nu e studiat.
 * Primul nivel nu e niciodată blocat.
 */
async function isLevelLocked(
  supabase: SessionClient,
  userId: string,
  levelId: number,
): Promise<boolean> {
  const { data: level, error: levelError } = await supabase
    .from("levels")
    .select("position")
    .eq("id", levelId)
    .maybeSingle();

  if (levelError) {
    throw new Error(`Nu am putut verifica nivelul: ${levelError.message}`);
  }
  if (!level) {
    throw new Error("Nivelul nu există.");
  }

  const { data: previous, error: previousError } = await supabase
    .from("levels")
    .select("id")
    .lt("position", level.position)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (previousError) {
    throw new Error(`Nu am putut verifica nivelul anterior: ${previousError.message}`);
  }
  if (!previous) {
    return false;
  }

  const { data: previousProgress, error: progressError } = await supabase
    .from("level_progress")
    .select("studied_at")
    .eq("user_id", userId)
    .eq("level_id", previous.id)
    .maybeSingle();

  if (progressError) {
    throw new Error(`Nu am putut verifica progresul: ${progressError.message}`);
  }
  return previousProgress?.studied_at == null;
}

/**
 * Dacă lecțiile, exersarea și instrumentul sunt gata, setează `studied_at`
 * (o singură dată). Folosește funcția SQL `is_level_studied`.
 */
async function refreshLevelStudied(userId: string, levelId: number): Promise<boolean> {
  const admin = createAdminClient();

  const { data: done, error } = await admin.rpc("is_level_studied", {
    p_user_id: userId,
    p_level_id: levelId,
  });
  if (error) {
    throw new Error(`Nu am putut verifica dacă nivelul e studiat: ${error.message}`);
  }
  if (done !== true) {
    return false;
  }

  const now = new Date().toISOString();
  const { error: updateError } = await admin
    .from("level_progress")
    .update({ studied_at: now, updated_at: now })
    .eq("user_id", userId)
    .eq("level_id", levelId)
    .is("studied_at", null);

  if (updateError) {
    throw new Error(`Nu am putut marca nivelul ca studiat: ${updateError.message}`);
  }
  return true;
}

/** Marchează un pas al nivelului (exersare sau instrument) și recalculează starea nivelului. */
async function markStep(column: StepColumn, levelId: number): Promise<{ studied: boolean }> {
  const supabase = await createClient();
  const userId = await requireUserId(supabase);

  if (await isLevelLocked(supabase, userId, levelId)) {
    throw new Error("Nivelul este blocat. Termină întâi nivelul anterior.");
  }

  // Scrierea se face prin service_role, ca progresul să nu poată fi falsificat din browser.
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("level_progress")
    .upsert(
      { user_id: userId, level_id: levelId, [column]: now, updated_at: now },
      { onConflict: "user_id,level_id" },
    );

  if (error) {
    throw new Error(`Nu am putut salva progresul: ${error.message}`);
  }

  return { studied: await refreshLevelStudied(userId, levelId) };
}

/** Marchează exersarea nivelului ca terminată. Folosită de finishPractice (#81). */
export async function markPracticeDone(levelId: number) {
  return markStep("practice_done_at", levelId);
}

/** Marchează instrumentul nivelului ca folosit. */
export async function markToolDone(levelId: number) {
  return markStep("tool_done_at", levelId);
}
