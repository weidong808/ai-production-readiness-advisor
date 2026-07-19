import type { AssessmentInput } from "@/lib/scoring/types";

const STORAGE_KEY = "apra.assessment.v1";

export type PersistedAssessment = {
  version: 1;
  updatedAt: string;
  step: string;
  input: AssessmentInput;
};

export function loadAssessment(): PersistedAssessment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAssessment;
  } catch {
    return null;
  }
}

export function saveAssessment(data: PersistedAssessment): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAssessment(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
