export type BudgetInput = {
  income: number;
  rent: number;
  utilities: number;
  food: number;
  transport: number;
  other: number;
};

export type ExpenseField = Exclude<keyof BudgetInput, "income">;

export const EXPENSE_FIELDS: readonly ExpenseField[] = [
  "rent",
  "utilities",
  "food",
  "transport",
  "other",
];

/** Suma tuturor cheltuielilor lunare. */
export function totalExpenses(input: BudgetInput): number {
  return EXPENSE_FIELDS.reduce((sum, field) => sum + input[field], 0);
}

/** Soldul rămas: venitul minus toate cheltuielile. Poate fi negativ. */
export function calculateBalance(input: BudgetInput): number {
  return input.income - totalExpenses(input);
}
