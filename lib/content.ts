// Formatul fișierelor content/level-N.json (#2) și validarea lor.
// Folosit de importul în Supabase din backend/seed.mjs (#47).
// Fișierul conține doar sintaxă TypeScript care se poate elimina (fără enum), ca Node să-l poată rula direct.

export type LessonContent = {
  position: number;
  title: string;
  video_url: string;
  duration_sec: number;
  description: string;
};

export type QuestionContent = {
  /** Id stabil, ex. "L1-Q07". Nu se schimbă după ce întrebarea a fost importată. */
  id: string;
  text: string;
  options: string[];
  /** Pozițiile variantelor corecte, numerotate de la 0. Pot fi mai multe. */
  correct: number[];
  explanation: string;
};

export type LevelContent = {
  /** Numărul nivelului, de la 1 la 4. */
  position: number;
  title: string;
  description: string;
  /** Instrumentul nivelului, ex. "buget-personal". */
  tool: string;
  lessons: LessonContent[];
  questions: QuestionContent[];
};

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIntegerAtLeast(value: unknown, min: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min;
}

function validateLesson(lesson: unknown): string[] {
  if (!isObject(lesson)) return ["trebuie să fie un obiect."];

  const errors: string[] = [];
  if (!isIntegerAtLeast(lesson.position, 1))
    errors.push("position trebuie să fie un număr întreg ≥ 1.");
  if (!isText(lesson.title)) errors.push("title lipsește sau e gol.");
  if (typeof lesson.video_url !== "string") errors.push("video_url lipsește.");
  if (!isIntegerAtLeast(lesson.duration_sec, 0)) {
    errors.push("duration_sec trebuie să fie un număr întreg ≥ 0.");
  }
  if (!isText(lesson.description)) errors.push("description lipsește sau e gol.");
  return errors;
}

function validateQuestion(question: unknown): string[] {
  if (!isObject(question)) return ["trebuie să fie un obiect."];

  const errors: string[] = [];
  const { options, correct } = question;

  if (!isText(question.id)) errors.push("id lipsește sau e gol.");
  if (!isText(question.text)) errors.push("text lipsește sau e gol.");

  const optionCount = Array.isArray(options) ? options.length : 0;
  if (!Array.isArray(options) || optionCount < 2) {
    errors.push("options trebuie să fie o listă cu cel puțin 2 variante.");
  } else if (!options.every(isText)) {
    errors.push("toate variantele din options trebuie să fie texte negoale.");
  }

  if (!Array.isArray(correct) || correct.length === 0) {
    errors.push("correct trebuie să conțină cel puțin un răspuns corect.");
  } else {
    for (const index of correct) {
      if (!isIntegerAtLeast(index, 0) || index >= optionCount) {
        errors.push(`indicele ${JSON.stringify(index)} din correct nu corespunde unei variante.`);
      }
    }
    if (new Set(correct).size !== correct.length) {
      errors.push("correct conține același indice de mai multe ori.");
    }
  }

  if (!isText(question.explanation)) errors.push("explanation lipsește sau e gol.");
  return errors;
}

/**
 * Verifică un fișier de nivel. Întoarce lista de erori, goală dacă fișierul e valid.
 * Fiecare eroare spune unde apare: lecția (după poziție în listă) sau întrebarea (după id).
 */
export function validateLevel(data: unknown): string[] {
  if (!isObject(data)) return ["fișierul trebuie să conțină un obiect JSON."];

  const errors: string[] = [];

  if (!isIntegerAtLeast(data.position, 1) || data.position > 4) {
    errors.push("position trebuie să fie un număr între 1 și 4.");
  }
  if (!isText(data.title)) errors.push("title lipsește sau e gol.");
  if (!isText(data.description)) errors.push("description lipsește sau e gol.");
  if (!isText(data.tool)) errors.push("tool lipsește sau e gol.");

  if (!Array.isArray(data.lessons)) {
    errors.push("lessons trebuie să fie o listă.");
  } else {
    data.lessons.forEach((lesson, i) => {
      for (const error of validateLesson(lesson)) errors.push(`lecția ${i + 1}: ${error}`);
    });
  }

  if (!Array.isArray(data.questions)) {
    errors.push("questions trebuie să fie o listă.");
  } else {
    const seenIds = new Set<string>();
    data.questions.forEach((question, i) => {
      const id = isObject(question) && isText(question.id) ? question.id : null;
      const label = id ?? `întrebarea ${i + 1}`;
      for (const error of validateQuestion(question)) errors.push(`${label}: ${error}`);
      if (id !== null) {
        if (seenIds.has(id)) errors.push(`${id}: id-ul apare de mai multe ori în fișier.`);
        seenIds.add(id);
      }
    });
  }

  return errors;
}
