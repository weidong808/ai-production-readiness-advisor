import { createHash } from "node:crypto";
import type { ReadinessReport } from "@/lib/schema/narrative";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

type CacheEntry = {
  expiresAt: number;
  report: ReadinessReport;
};

const store = new Map<string, CacheEntry>();
const TTL_MS = 1000 * 60 * 60; // 1 hour in-memory

export function narrativeCacheKey(args: {
  input: AssessmentInput;
  scoring: ScoringResult;
  corpusVersion: string;
  promptVersion: string;
  model: string;
}): string {
  const payload = JSON.stringify({
    context: args.input.context,
    answers: args.input.answers,
    freeText: args.input.freeText ?? {},
    finalBand: args.scoring.finalBand,
    overallScore: args.scoring.overallScore,
    gates: args.scoring.hardGatesApplied.map((g) => g.gateId),
    corpusVersion: args.corpusVersion,
    promptVersion: args.promptVersion,
    model: args.model,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function getCachedNarrative(key: string): ReadinessReport | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.report;
}

export function setCachedNarrative(key: string, report: ReadinessReport) {
  store.set(key, { report, expiresAt: Date.now() + TTL_MS });
}
