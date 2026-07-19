import type { OrdinalChoice } from "@/lib/scoring/types";

export const CHOICE_POINTS: Record<OrdinalChoice, number> = {
  A: 3,
  B: 2,
  C: 1,
  D: 0,
};

export function pointsForChoice(choice: OrdinalChoice): number {
  return CHOICE_POINTS[choice];
}
