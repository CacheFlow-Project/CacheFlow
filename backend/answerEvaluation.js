export function normalizeAnswerSet(values) {
  if (!Array.isArray(values)) return null;

  const normalized = values.reduce((acc, item) => {
    if (!Number.isInteger(item)) return acc;
    acc.push(item);
    return acc;
  }, []);

  if (normalized.length !== values.length) {
    return null;
  }

  const unique = [...new Set(normalized)];
  return unique.sort((a, b) => a - b);
}

export function isAnswerCorrect(selected, correct) {
  const normalizedSelected = normalizeAnswerSet(selected);
  const normalizedCorrect = normalizeAnswerSet(correct);

  if (normalizedSelected === null || normalizedCorrect === null) {
    return false;
  }

  if (normalizedSelected.length !== normalizedCorrect.length) {
    return false;
  }

  return normalizedSelected.every((value, index) => value === normalizedCorrect[index]);
}
