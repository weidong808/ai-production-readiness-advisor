import { CORPUS_VERSION, resolveCitations } from "@/lib/corpus/load";
import { PROMPT_VERSION } from "@/lib/ai/prompt";
import type { LlmNarrative, ReadinessReport } from "@/lib/schema/narrative";
import { scrubBlocklist } from "@/lib/security/blocklist";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

const DISCLAIMER =
  "Advisory only. Not a certification, audit, or legal opinion.";

function scrubNarrative(n: LlmNarrative): LlmNarrative {
  return {
    executiveSummary: scrubBlocklist(n.executiveSummary),
    dimensionNarratives: n.dimensionNarratives.map((d) => ({
      ...d,
      narrative: scrubBlocklist(d.narrative),
    })),
    risks: n.risks.map((r) => ({
      ...r,
      title: scrubBlocklist(r.title),
      description: scrubBlocklist(r.description),
    })),
    remediationPlan: n.remediationPlan.map((m) => ({
      ...m,
      title: scrubBlocklist(m.title),
      description: scrubBlocklist(m.description),
    })),
    citationIdsUsed: n.citationIdsUsed,
  };
}

export function buildScoresOnlyReport(args: {
  assessmentId: string;
  createdAt: string;
  input: AssessmentInput;
  scoring: ScoringResult;
  narrativeStatus: "unavailable" | "schema_failed";
  modelId: string;
}): ReadinessReport {
  return {
    schemaVersion: "report@0.1.0",
    context: {
      assessmentId: args.assessmentId,
      createdAt: args.createdAt,
      rubricVersion: args.scoring.rubricVersion,
      questionsVersion: args.scoring.questionsVersion,
      corpusVersion: CORPUS_VERSION,
      ...args.input.context,
    },
    overallScore: args.scoring.overallScore,
    scoreBand: args.scoring.scoreBand,
    finalBand: args.scoring.finalBand,
    hardGatesApplied: args.scoring.hardGatesApplied,
    dimensions: args.scoring.dimensions,
    executiveSummary: "",
    dimensionNarratives: [],
    risks: [],
    remediationPlan: [],
    citations: [],
    disclaimer: DISCLAIMER,
    model: {
      provider: "openai",
      modelId: args.modelId,
      promptVersion: PROMPT_VERSION,
      narrativeStatus: args.narrativeStatus,
    },
  };
}

export function mergeNarrativeReport(args: {
  assessmentId: string;
  createdAt: string;
  input: AssessmentInput;
  scoring: ScoringResult;
  narrative: LlmNarrative;
  modelId: string;
}): ReadinessReport {
  const scrubbed = scrubNarrative(args.narrative);
  const citationIds = [
    ...scrubbed.citationIdsUsed,
    ...scrubbed.risks.flatMap((r) => r.citationIds),
    ...scrubbed.remediationPlan.flatMap((m) => m.citationIds),
  ];
  const { citations, unknown } = resolveCitations(citationIds);

  const known = new Set(citations.map((c) => c.id));
  const filterIds = (ids: string[]) => ids.filter((id) => known.has(id));

  return {
    schemaVersion: "report@0.1.0",
    context: {
      assessmentId: args.assessmentId,
      createdAt: args.createdAt,
      rubricVersion: args.scoring.rubricVersion,
      questionsVersion: args.scoring.questionsVersion,
      corpusVersion: CORPUS_VERSION,
      ...args.input.context,
    },
    overallScore: args.scoring.overallScore,
    scoreBand: args.scoring.scoreBand,
    finalBand: args.scoring.finalBand,
    hardGatesApplied: args.scoring.hardGatesApplied,
    dimensions: args.scoring.dimensions,
    executiveSummary: scrubbed.executiveSummary,
    dimensionNarratives: scrubbed.dimensionNarratives,
    risks: scrubbed.risks.map((r) => ({
      ...r,
      citationIds: filterIds(r.citationIds),
    })),
    remediationPlan: scrubbed.remediationPlan.map((m) => ({
      ...m,
      citationIds: filterIds(m.citationIds),
    })),
    citations,
    disclaimer: DISCLAIMER,
    model: {
      provider: "openai",
      modelId: args.modelId,
      promptVersion: PROMPT_VERSION,
      narrativeStatus: "ok",
    },
    // unknown citations intentionally dropped; available for logging by caller
    ...(unknown.length ? {} : {}),
  };
}

export function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model response was not valid JSON");
  }
}
