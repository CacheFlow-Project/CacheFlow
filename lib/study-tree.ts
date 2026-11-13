// Calculul stării nivelurilor (#78): blocat / deschis / studiat + pașii bifați.
// Funcție pură, fără acces la baza de date, ca să poată fi testată unitar.
// Datele le citește getStudyTree din backend/levels.ts.
import type { Level } from "./levels";

export type LevelRow = { id: number; title: string; position: number };
export type LessonRow = { id: number; level_id: number };
export type LevelProgressRow = {
  level_id: number;
  practice_done_at: string | null;
  tool_done_at: string | null;
  studied_at: string | null;
};

/**
 * Nivelul 1 e mereu deschis; nivelul N+1 e deschis dacă nivelul N e studiat.
 * Un nivel e studiat când are `studied_at` (setat pe server după lecții + exersare + instrument).
 */
export function computeStudyTree(
  levels: readonly LevelRow[],
  lessons: readonly LessonRow[],
  watchedLessonIds: ReadonlySet<number>,
  progress: readonly LevelProgressRow[],
): Level[] {
  const progressByLevel = new Map(progress.map((row) => [row.level_id, row]));
  const ordered = [...levels].sort((a, b) => a.position - b.position);

  let previousStudied = true;
  return ordered.map((level) => {
    const levelLessons = lessons.filter((lesson) => lesson.level_id === level.id);
    const row = progressByLevel.get(level.id);
    const studied = row?.studied_at != null;
    const state = studied ? "studied" : previousStudied ? "open" : "locked";
    previousStudied = studied;

    return {
      id: level.id,
      name: level.title,
      state,
      steps: {
        lessons:
          levelLessons.length > 0 &&
          levelLessons.every((lesson) => watchedLessonIds.has(lesson.id)),
        practice: row?.practice_done_at != null,
        tool: row?.tool_done_at != null,
      },
    };
  });
}
