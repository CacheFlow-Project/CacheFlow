// Marcarea pașilor unui nivel în `level_progress` (#78).
// Fișierul NU are "use server": funcțiile de aici nu sunt Server Actions și nu pot fi
// apelate din browser. Se folosesc doar din alt cod de server (ex. finishPractice),
// după ce acel cod a verificat că pasul a fost făcut cu adevărat.
import { createAdminClient } from "@/lib/supabase/admin";

export type StepColumn = "practice_done_at" | "tool_done_at";

/**
 * Un nivel e blocat dacă nivelul dinaintea lui (după `position`) nu e studiat.
 * Primul nivel nu e niciodată blocat.
 */
async function isLevelLocked(userId: string, levelId: number): Promise<boolean> {
  const admin = createAdminClient();

  const { data: level, error: levelError } = await admin
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

  const { data: previous, error: previousError } = await admin
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

  const { data: previousProgress, error: progressError } = await admin
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

/**
 * Marchează un pas al nivelului și recalculează starea nivelului.
 * `userId` trebuie să vină din sesiune, citit de codul de server care apelează funcția.
 */
export async function markStep(
  userId: string,
  column: StepColumn,
  levelId: number,
): Promise<{ studied: boolean }> {
  if (await isLevelLocked(userId, levelId)) {
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

/** Marchează exersarea nivelului ca terminată. Apelată doar din finishPractice (#81). */
export async function markPracticeDone(userId: string, levelId: number) {
  return markStep(userId, "practice_done_at", levelId);
}
