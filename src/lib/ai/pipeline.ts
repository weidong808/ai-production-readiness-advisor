import {
  buildScoresOnlyReport,
  extractJsonObject,
  mergeNarrativeReport,
} from "@/lib/ai/merge";
import { normalizeLlmNarrative } from "@/lib/ai/normalize";
import { summarizeProviderError } from "@/lib/ai/openai";
import { rawNarrativeHasFatalShapeErrors } from "@/lib/ai/raw-shape";
import { retrieveChunks } from "@/lib/corpus/retrieve";
import { llmNarrativeSchema } from "@/lib/schema/narrative";
import type { ReadinessReport } from "@/lib/schema/narrative";
import { redactFreeTextMap } from "@/lib/security/redact";
import { scoreAssessment } from "@/lib/scoring/score";
import type { AssessmentInput } from "@/lib/scoring/types";

export type NarrativeGenerator = (args: {
  assessmentId: string;
  input: AssessmentInput;
  scoring: ReturnType<typeof scoreAssessment>;
  chunks: ReturnType<typeof retrieveChunks>;
  /** When set, model should fix prior JSON/schema issues (one repair pass). */
  repairHint?: string;
}) => Promise<{ text: string; modelId: string }>;

export type PipelineResult = {
  report: ReadinessReport;
  scoring: ReturnType<typeof scoreAssessment>;
  meta: {
    redactions: string[];
    shapeErrors?: string[];
    schemaIssues?: { path: string; message: string }[];
    providerError?: string;
    /** True when the successful report came from the schema-repair retry. */
    repaired?: boolean;
  };
};

type ParseOutcome =
  | {
      ok: true;
      narrative: ReturnType<typeof llmNarrativeSchema.parse>;
      modelId: string;
    }
  | {
      ok: false;
      modelId: string;
      shapeErrors?: string[];
      schemaIssues?: { path: string; message: string }[];
      repairHint: string;
    };

function formatSchemaIssues(
  issues: { path: string; message: string }[],
): string {
  return issues.map((i) => `${i.path || "(root)"}: ${i.message}`).join("; ");
}

function parseModelText(text: string, modelId: string): ParseOutcome {
  let raw: unknown;
  try {
    raw = extractJsonObject(text);
  } catch {
    return {
      ok: false,
      modelId,
      shapeErrors: ["invalid_json"],
      repairHint:
        "Your previous response was not valid JSON. Return a single JSON object only, with no markdown fences.",
    };
  }

  const shapeErrors = rawNarrativeHasFatalShapeErrors(raw);
  if (shapeErrors.length) {
    return {
      ok: false,
      modelId,
      shapeErrors,
      repairHint: `Your previous JSON failed shape checks: ${shapeErrors.join(", ")}. Fix the structure and return valid JSON matching the schema.`,
    };
  }

  const normalized = normalizeLlmNarrative(raw);
  const narrative = llmNarrativeSchema.safeParse(normalized);
  if (!narrative.success) {
    const schemaIssues = narrative.error.issues.slice(0, 8).map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return {
      ok: false,
      modelId,
      schemaIssues,
      repairHint: `Your previous JSON failed schema validation: ${formatSchemaIssues(schemaIssues)}. Fix these fields and return valid JSON only.`,
    };
  }

  return { ok: true, narrative: narrative.data, modelId };
}

/**
 * Deterministic + narrative merge pipeline (mockable generator for CI).
 * On schema/parse failure, retries once with validation errors in the prompt.
 */
export async function runNarrativePipeline(args: {
  assessmentId: string;
  createdAt: string;
  input: AssessmentInput;
  modelIdFallback: string;
  generate: NarrativeGenerator;
}): Promise<PipelineResult> {
  const { freeText, redactions } = redactFreeTextMap(args.input.freeText);
  const input: AssessmentInput = { ...args.input, freeText };
  const scoring = scoreAssessment(input);
  const chunks = retrieveChunks(scoring);

  try {
    const first = await args.generate({
      assessmentId: args.assessmentId,
      input,
      scoring,
      chunks,
    });
    let parsed = parseModelText(first.text, first.modelId);

    let repaired = false;
    if (!parsed.ok) {
      const retry = await args.generate({
        assessmentId: args.assessmentId,
        input,
        scoring,
        chunks,
        repairHint: parsed.repairHint,
      });
      const repairedParse = parseModelText(retry.text, retry.modelId);
      if (!repairedParse.ok) {
        return {
          report: buildScoresOnlyReport({
            assessmentId: args.assessmentId,
            createdAt: args.createdAt,
            input,
            scoring,
            narrativeStatus: "schema_failed",
            modelId: repairedParse.modelId,
          }),
          scoring,
          meta: {
            redactions,
            shapeErrors: repairedParse.shapeErrors,
            schemaIssues: repairedParse.schemaIssues,
          },
        };
      }
      parsed = repairedParse;
      repaired = true;
    }

    return {
      report: mergeNarrativeReport({
        assessmentId: args.assessmentId,
        createdAt: args.createdAt,
        input,
        scoring,
        narrative: parsed.narrative,
        modelId: parsed.modelId,
      }),
      scoring,
      meta: { redactions, repaired: repaired || undefined },
    };
  } catch (err) {
    return {
      report: buildScoresOnlyReport({
        assessmentId: args.assessmentId,
        createdAt: args.createdAt,
        input,
        scoring,
        narrativeStatus: "unavailable",
        modelId: args.modelIdFallback,
      }),
      scoring,
      meta: { redactions, providerError: summarizeProviderError(err) },
    };
  }
}
