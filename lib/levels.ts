import type { Status } from "@/components/StatusBadge";

export type LevelState = "locked" | "open" | "studied";

export type LevelSteps = {
  lessons: boolean;
  practice: boolean;
  tool: boolean;
};

export type Level = {
  id: number;
  name: string;
  state: LevelState;
  steps: LevelSteps;
};

// DATE TEMPORARE (#4). Starea reală a nivelurilor vine din #78 ([BE] Starea nivelurilor),
// în Sprint 2. Atunci se înlocuiește doar această listă.
export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Bugetul personal",
    state: "studied",
    steps: { lessons: true, practice: true, tool: true },
  },
  {
    id: 2,
    name: "Economii și urgențe",
    state: "open",
    steps: { lessons: true, practice: false, tool: false },
  },
  {
    id: 3,
    name: "Taxe și salariu",
    state: "locked",
    steps: { lessons: false, practice: false, tool: false },
  },
  {
    id: 4,
    name: "Investiții și dobândă",
    state: "locked",
    steps: { lessons: false, practice: false, tool: false },
  },
];

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((level) => level.id === id);
}

export const LEVEL_BADGE: Record<LevelState, { status: Status; label: string }> = {
  locked: { status: "locked", label: "Blocat" },
  open: { status: "available", label: "Deschis" },
  studied: { status: "passed", label: "Studiat" },
};
