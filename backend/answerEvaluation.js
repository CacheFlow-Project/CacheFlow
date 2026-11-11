export function normalizeAnswerSet(values) {
  if (!Array.isArray(values)) return [];
  const uniqueValues = [...new Set(values.filter((value) => Number.isInteger(value)))];
  return uniqueValues.sort((a, b) => a - b);
}

export function isAnswerCorrect(selected, correct) {
  const normalizedSelected = normalizeAnswerSet(selected);
  const normalizedCorrect = normalizeAnswerSet(correct);

  if (normalizedSelected.length !== normalizedCorrect.length) {
    return false;
  }

  return normalizedSelected.every((value, index) => value === normalizedCorrect[index]);
}
