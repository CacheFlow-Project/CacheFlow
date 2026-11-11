"use client";

import { useState } from "react";
import { type BudgetInput, calculateBalance } from "@/lib/budget";
import Button from "@/components/Button";
import Card from "@/components/Card";

type Field = keyof BudgetInput;

const FIELDS: { key: Field; label: string }[] = [
  { key: "income", label: "Venit lunar" },
  { key: "rent", label: "Chirie" },
  { key: "utilities", label: "Utilități / facturi" },
  { key: "food", label: "Mâncare" },
  { key: "transport", label: "Transport" },
  { key: "other", label: "Alte cheltuieli" },
];

const EMPTY_VALUES: Record<Field, string> = {
  income: "",
  rent: "",
  utilities: "",
  food: "",
  transport: "",
  other: "",
};

// Lista de cheltuieli neprevăzute (doar numele). Suma o introduce utilizatorul,
// pentru că aceeași cheltuială poate costa foarte diferit.
const UNEXPECTED_EXPENSES = ["Reparație", "Medicamente", "Amendă"];

// Doar cifre, opțional cu virgulă sau punct și cel mult 2 zecimale (ex. 1234,50 sau 1234.50).
// Minusul și literele nu se pot introduce.
const AMOUNT_PATTERN = /^\d*([.,]\d{0,2})?$/;

/** Transformă textul din câmp în bani (1 leu = 100 bani). Câmpul gol contează ca 0. */
function toBani(value: string): number {
  const amount = Number(value.replace(",", "."));
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

function formatLei(bani: number): string {
  const hasDecimals = bani % 100 !== 0;
  return (bani / 100).toLocaleString("ro-RO", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

const INPUT_CLASSES =
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-base";

export default function BudgetSimulator() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [showUnexpected, setShowUnexpected] = useState(false);
  const [unexpectedName, setUnexpectedName] = useState("");
  const [unexpectedAmount, setUnexpectedAmount] = useState("");

  function handleChange(field: Field, raw: string) {
    // Ignoră orice tastare care nu respectă formatul, ca să nu apară niciodată NaN.
    if (!AMOUNT_PATTERN.test(raw)) return;
    setValues((previous) => ({ ...previous, [field]: raw }));
  }

  function handleUnexpectedAmount(raw: string) {
    if (!AMOUNT_PATTERN.test(raw)) return;
    setUnexpectedAmount(raw);
  }

  function removeUnexpected() {
    setShowUnexpected(false);
    setUnexpectedName("");
    setUnexpectedAmount("");
  }

  // Calculul se face în bani (numere întregi), ca să nu apară erori de rotunjire la zecimale.
  const balance =
    calculateBalance({
      income: toBani(values.income),
      rent: toBani(values.rent),
      utilities: toBani(values.utilities),
      food: toBani(values.food),
      transport: toBani(values.transport),
      other: toBani(values.other),
    }) - (showUnexpected && unexpectedName ? toBani(unexpectedAmount) : 0);
  const isNegative = balance < 0;

  return (
    <Card>
      <div className="flex flex-col gap-3">
        {FIELDS.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{label}</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={15}
              placeholder="0"
              value={values[key]}
              onChange={(event) => handleChange(key, event.target.value)}
              className={INPUT_CLASSES}
            />
          </label>
        ))}
      </div>

      <div className="border-border mt-6 border-t pt-4">
        {showUnexpected ? (
          <div className="bg-wrong-soft flex flex-col gap-3 rounded-lg p-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Cheltuială neprevăzută</span>
              <select
                value={unexpectedName}
                onChange={(event) => setUnexpectedName(event.target.value)}
                className={INPUT_CLASSES}
              >
                <option value="">Alege ce s-a întâmplat</option>
                {UNEXPECTED_EXPENSES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            {unexpectedName && (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Cât te-a costat?</span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={15}
                  placeholder="0"
                  value={unexpectedAmount}
                  onChange={(event) => handleUnexpectedAmount(event.target.value)}
                  className={INPUT_CLASSES}
                />
              </label>
            )}

            <Button variant="secondary" onClick={removeUnexpected}>
              Renunță la cheltuială
            </Button>
          </div>
        ) : (
          <Button variant="secondary" className="w-full" onClick={() => setShowUnexpected(true)}>
            Ce se poate întâmpla?
          </Button>
        )}
      </div>

      <div className="border-border mt-6 border-t pt-4" aria-live="polite">
        <p className="text-muted text-sm">Sold rămas</p>
        <p
          className={`text-2xl font-bold break-words ${isNegative ? "text-wrong" : "text-foreground"}`}
        >
          {formatLei(balance)} lei
        </p>
      </div>
    </Card>
  );
}
