import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateLevel(level) {
  assert(level && typeof level === "object", "Level file is invalid");
  assert(typeof level.position === "number", "Missing level.position");
  assert(typeof level.title === "string", "Missing level.title");
  assert(typeof level.description === "string", "Missing level.description");
  assert(typeof level.tool === "string", "Missing level.tool");
  assert(Array.isArray(level.lessons), "Missing level.lessons[]");
  assert(Array.isArray(level.questions), "Missing level.questions[]");
}

function validateLesson(lesson) {
  assert(typeof lesson.position === "number", "Lesson.position is required");
  assert(typeof lesson.title === "string", "Lesson.title is required");
  assert(typeof lesson.description === "string", "Lesson.description is required");
}

function validateQuestion(question) {
  assert(typeof question.id === "string", "Question.id is required");
  assert(typeof question.text === "string", "Question.text is required");
  assert(Array.isArray(question.options), "Question.options must be an array");
  assert(question.options.length >= 2, "Question must have at least 2 answers");
  assert(Array.isArray(question.correct), "Question.correct must be an array");
  assert(question.correct.length > 0, "Question must have at least 1 correct answer");
  for (const index of question.correct) {
    assert(
      Number.isInteger(index) && index >= 0 && index < question.options.length,
      `Invalid correct index: ${index}`
    );
  }
  assert(typeof question.explanation === "string", "Question.explanation is required");
}

async function readJson(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${filePath}: invalid JSON - ${error.message}`);
  }
}

async function ensureLevel(levelData) {
  const { data: existing, error: existingError } = await supabase
    .from("levels")
    .select("id")
    .eq("position", levelData.position)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) return existing.id;

  const { data: inserted, error: insertError } = await supabase
    .from("levels")
    .insert({
      title: levelData.title,
      description: levelData.description,
      position: levelData.position,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return inserted.id;
}

async function ensureLesson(levelId, lessonData) {
  const { data: existing, error: existingError } = await supabase
    .from("lessons")
    .select("id")
    .eq("level_id", levelId)
    .eq("position", lessonData.position)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) return existing.id;

  const { data: inserted, error: insertError } = await supabase
    .from("lessons")
    .insert({
      level_id: levelId,
      title: lessonData.title,
      content: lessonData.description,
      position: lessonData.position,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return inserted.id;
}

async function ensureQuestion(lessonId, question) {
  const { data: existing, error: existingError } = await supabase
    .from("questions")
    .select("id")
    .eq("stable_id", question.id)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { error: updateError } = await supabase
      .from("questions")
      .update({
        lesson_id: lessonId,
        question_text: question.text,
        options: question.options,
        correct_answer: JSON.stringify(question.correct),
        explanation: question.explanation,
      })
      .eq("id", existing.id);

    if (updateError) throw updateError;
    return;
  }

  const { error: insertError } = await supabase.from("questions").insert({
    lesson_id: lessonId,
    stable_id: question.id,
    question_text: question.text,
    options: question.options,
    correct_answer: JSON.stringify(question.correct),
    explanation: question.explanation,
  });

  if (insertError) throw insertError;
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");
  const files = (await fs.readdir(contentDir))
    .filter((name) => name.endsWith(".json") && name.startsWith("level-"))
    .sort();

  if (files.length === 0) {
    throw new Error("No level JSON files found in content/.");
  }

  const reports = [];

  for (const file of files) {
    const fullPath = path.join(contentDir, file);
    const payload = await readJson(fullPath);
    validateLevel(payload);

    for (const lesson of payload.lessons) {
      validateLesson(lesson);
    }

    for (const question of payload.questions) {
      validateQuestion(question);
    }

    if (payload.questions.length < 30) {
  console.warn(
    `Warning: ${file} has only ${payload.questions.length} questions; repeated testing may not be reliable.`
  );
}

    const levelId = await ensureLevel(payload);

    for (const lesson of payload.lessons) {
      const lessonId = await ensureLesson(levelId, lesson);

      const questionsForLesson = payload.questions.filter((q) => {
        return q.id.startsWith(`L${payload.position}-`);
      });

      for (const question of questionsForLesson) {
        await ensureQuestion(lessonId, question);
      }
    }

    const questionCount = payload.questions.length;
    reports.push(`${file}: ${questionCount} întrebări`);
  }

  console.log("Seed finalizat cu succes.");
  for (const report of reports) {
    console.log(report);
  }
}

main().catch((error) => {
  console.error("Seed failed:");
  console.error(error.message || error);
  process.exit(1);
});
