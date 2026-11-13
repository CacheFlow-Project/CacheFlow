// Importă nivelurile, lecțiile și întrebările din content/level-*.json în Supabase (#47).
// Rulare: npm run seed (citește .env.local). Cheia service_role se folosește doar local.
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { validateLevel } from "../lib/content.ts";

const MIN_QUESTIONS_PER_LEVEL = 30;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Lipsesc variabilele de mediu. Completează NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY în .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

/** Citește și validează un fișier. La eroare spune fișierul și întrebarea problemă. */
async function readLevelFile(contentDir, fileName) {
  const text = await fs.readFile(path.join(contentDir, fileName), "utf8");

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`${fileName}: JSON invalid – ${error.message}`);
  }

  const errors = validateLevel(data);
  if (errors.length > 0) {
    throw new Error(`${fileName} nu e valid:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
  return data;
}

/** Verifică ce nu se vede dintr-un singur fișier: niveluri sau id-uri de întrebări repetate. */
function checkAcrossFiles(levelFiles) {
  const levelFileByPosition = new Map();
  const fileByQuestionId = new Map();
  const errors = [];

  for (const { fileName, level } of levelFiles) {
    const other = levelFileByPosition.get(level.position);
    if (other) errors.push(`${fileName}: nivelul ${level.position} apare și în ${other}.`);
    levelFileByPosition.set(level.position, fileName);

    for (const question of level.questions) {
      const otherFile = fileByQuestionId.get(question.id);
      if (otherFile) errors.push(`${fileName}: ${question.id} apare și în ${otherFile}.`);
      fileByQuestionId.set(question.id, fileName);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Conținutul nu e valid:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
}

async function upsertLevel(level) {
  const { data, error } = await supabase
    .from("levels")
    .upsert(
      { position: level.position, title: level.title, description: level.description },
      { onConflict: "position" },
    )
    .select("id")
    .single();

  if (error) throw new Error(`Nivelul ${level.position}: ${error.message}`);
  return data.id;
}

async function upsertLessons(levelId, level) {
  if (level.lessons.length === 0) return;

  const rows = level.lessons.map((lesson) => ({
    level_id: levelId,
    position: lesson.position,
    title: lesson.title,
    content: lesson.description,
  }));

  const { error } = await supabase
    .from("lessons")
    .upsert(rows, { onConflict: "level_id,position" });
  if (error) throw new Error(`Lecțiile nivelului ${level.position}: ${error.message}`);
}

// Întrebările se leagă de nivel. lesson_id nu se trimite: e opțional și o actualizare nu-l modifică.
async function upsertQuestions(levelId, level) {
  if (level.questions.length === 0) return;

  const rows = level.questions.map((question) => ({
    external_id: question.id,
    level_id: levelId,
    question_text: question.text,
    options: question.options,
    correct_answers: question.correct,
    explanation: question.explanation,
  }));

  const { error } = await supabase.from("questions").upsert(rows, { onConflict: "external_id" });
  if (error) throw new Error(`Întrebările nivelului ${level.position}: ${error.message}`);
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");
  const fileNames = (await fs.readdir(contentDir))
    .filter((name) => /^level-\d+\.json$/.test(name))
    .sort();

  if (fileNames.length === 0) {
    throw new Error("Nu există fișiere content/level-*.json.");
  }

  // Toate fișierele se validează înainte de import, ca o eroare să nu lase baza importată pe jumătate.
  const levelFiles = [];
  for (const fileName of fileNames) {
    levelFiles.push({ fileName, level: await readLevelFile(contentDir, fileName) });
  }
  checkAcrossFiles(levelFiles);

  for (const { fileName, level } of levelFiles) {
    if (level.questions.length < MIN_QUESTIONS_PER_LEVEL) {
      console.warn(
        `Atenție: ${fileName} are doar ${level.questions.length} întrebări (minimum ${MIN_QUESTIONS_PER_LEVEL} pentru testele repetate).`,
      );
    }
  }

  const report = [];
  for (const { fileName, level } of levelFiles) {
    const levelId = await upsertLevel(level);
    await upsertLessons(levelId, level);
    await upsertQuestions(levelId, level);
    report.push(
      `Nivelul ${level.position} (${fileName}): ${level.lessons.length} lecții, ${level.questions.length} întrebări`,
    );
  }

  console.log("Import finalizat.");
  for (const line of report) console.log(`  ${line}`);
}

main().catch((error) => {
  console.error("Importul a eșuat:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
