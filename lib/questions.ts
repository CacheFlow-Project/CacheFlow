/** Răspunsul e corect doar dacă variantele bifate coincid exact cu variantele corecte. */
export function isExactMatch(selected: readonly number[], correct: readonly number[]): boolean {
  return selected.length === correct.length && correct.every((index) => selected.includes(index));
}
