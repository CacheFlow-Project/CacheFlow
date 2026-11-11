import test from "node:test";
import assert from "node:assert/strict";

import { isAnswerCorrect } from "./answerEvaluation.js";

test("răspunsul corect este validat", () => {
  assert.equal(isAnswerCorrect([0, 2], [2, 0]), true);
});

test("răspunsurile identice dar în ordine diferită sunt validate", () => {
  assert.equal(isAnswerCorrect([1, 3, 2], [2, 1, 3]), true);
});

test("răspunsul cu opțiune în plus este greșit", () => {
  assert.equal(isAnswerCorrect([0, 1, 2], [0, 1]), false);
});

test("răspunsul cu opțiune lipsă este greșit", () => {
  assert.equal(isAnswerCorrect([0, 1], [0, 1, 2]), false);
});

test("duplicatele nu contează", () => {
  assert.equal(isAnswerCorrect([1, 1, 2], [2, 1]), true);
});

test("răspunsul gol este valid doar dacă și corectul e gol", () => {
  assert.equal(isAnswerCorrect([], []), true);
  assert.equal(isAnswerCorrect([], [0]), false);
});

test("intrarea invalidă este respinsă", () => {
  assert.equal(isAnswerCorrect(null, [0]), false);
  assert.equal(isAnswerCorrect([0, "x"], [0]), false);
  assert.equal(isAnswerCorrect([0, 1], "x"), false);
});
