// Teste unitare pentru starea nivelurilor (#78). Rulare: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { computeStudyTree } from "./study-tree.ts";

const LEVELS = [
  { id: 1, title: "Bugetul personal", position: 1 },
  { id: 2, title: "Economii și urgențe", position: 2 },
  { id: 3, title: "Taxe și salariu", position: 3 },
  { id: 4, title: "Investiții și dobândă", position: 4 },
];
const LESSONS = [
  { id: 10, level_id: 1 },
  { id: 11, level_id: 1 },
  { id: 20, level_id: 2 },
];
const NOW = "2026-11-14T10:00:00.000Z";

function progress(levelId, { practice = false, tool = false, studied = false } = {}) {
  return {
    level_id: levelId,
    practice_done_at: practice ? NOW : null,
    tool_done_at: tool ? NOW : null,
    studied_at: studied ? NOW : null,
  };
}

const states = (tree) => tree.map((level) => level.state);

test("utilizator nou: nivelul 1 deschis, restul blocate, niciun pas bifat", () => {
  const tree = computeStudyTree(LEVELS, LESSONS, new Set(), []);
  assert.deepEqual(states(tree), ["open", "locked", "locked", "locked"]);
  assert.deepEqual(tree[0].steps, { lessons: false, practice: false, tool: false });
});

test("nivel pe jumătate: pașii făcuți sunt bifați, nivelul rămâne deschis", () => {
  const tree = computeStudyTree(LEVELS, LESSONS, new Set([10, 11]), [
    progress(1, { practice: true }),
  ]);
  assert.deepEqual(states(tree), ["open", "locked", "locked", "locked"]);
  assert.deepEqual(tree[0].steps, { lessons: true, practice: true, tool: false });
});

test("lecțiile sunt bifate doar dacă toate lecțiile nivelului sunt vizionate", () => {
  const tree = computeStudyTree(LEVELS, LESSONS, new Set([10]), []);
  assert.equal(tree[0].steps.lessons, false);
});

test("un nivel fără lecții nu are pasul de lecții bifat", () => {
  const tree = computeStudyTree(LEVELS, LESSONS, new Set(), []);
  assert.equal(tree[2].steps.lessons, false);
});

test("nivel studiat: nivelul următor se deschide", () => {
  const done = progress(1, { practice: true, tool: true, studied: true });
  const tree = computeStudyTree(LEVELS, LESSONS, new Set([10, 11]), [done]);
  assert.deepEqual(states(tree), ["studied", "open", "locked", "locked"]);
  assert.deepEqual(tree[0].steps, { lessons: true, practice: true, tool: true });
});

test("niveluri studiate la rând deschid doar nivelul imediat următor", () => {
  const tree = computeStudyTree(LEVELS, LESSONS, new Set(), [
    progress(1, { studied: true }),
    progress(2, { studied: true }),
  ]);
  assert.deepEqual(states(tree), ["studied", "studied", "open", "locked"]);
});

test("ordinea vine din position, nu din ordinea rândurilor", () => {
  const tree = computeStudyTree([...LEVELS].reverse(), LESSONS, new Set(), []);
  assert.deepEqual(
    tree.map((level) => level.id),
    [1, 2, 3, 4],
  );
  assert.equal(tree[0].state, "open");
});
