// Teste unitare pentru evaluarea răspunsurilor (#49). Rulare: npm test
// Folosesc runner-ul inclus în Node (node:test), fără pachete în plus.
import { test } from "node:test";
import assert from "node:assert/strict";
import { isExactMatch } from "./questions.ts";

test("un singur răspuns corect, bifat corect", () => {
  assert.equal(isExactMatch([0], [0]), true);
});

test("mai multe răspunsuri corecte, toate bifate (ordinea nu contează)", () => {
  assert.equal(isExactMatch([0, 2], [0, 2]), true);
  assert.equal(isExactMatch([2, 0], [0, 2]), true);
});

test("o variantă bifată în plus face răspunsul greșit", () => {
  assert.equal(isExactMatch([0, 1], [0]), false);
  assert.equal(isExactMatch([0, 1, 2], [0, 2]), false);
});

test("o variantă corectă nebifată face răspunsul greșit", () => {
  assert.equal(isExactMatch([0], [0, 2]), false);
});

test("nicio variantă bifată e răspuns greșit", () => {
  assert.equal(isExactMatch([], [0]), false);
  assert.equal(isExactMatch([], [0, 2]), false);
});

test("o variantă greșită în locul celei corecte", () => {
  assert.equal(isExactMatch([1], [0]), false);
  assert.equal(isExactMatch([0, 1], [0, 2]), false);
});
