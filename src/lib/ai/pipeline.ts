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
}) => Promise<{ text: string; modelId: string }>;

export type PipelineResult = {
  report: ReadinessReport;
  scoring: ReturnType<typeof scoreAssessment>;
  meta: {
    redactions: string[];
    shapeErrors?: string[];
    schemaIssues?: { path: string; message: string }[];
    providerError?: string;
  };
};

/**
 * Deterministic + narrative merge pipeline (mockable generator for CI).
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
    const { text, modelId } = await args.generate({
      assessmentId: args.assessmentId,
      input,
      scoring,
      chunks,
    });

    let raw: unknown;
    try {
      raw = extractJsonObject(text);
    } catch {
      return {
        report: buildScoresOnlyReport({
          assessmentId: args.assessmentId,
          createdAt: args.createdAt,
          input,
          scoring,
          narrativeStatus: "schema_failed",
          modelId,
        }),
        scoring,
        meta: { redactions, shapeErrors: ["invalid_json"] },
      };
    }

    const shapeErrors = rawNarrativeHasFatalShapeErrors(raw);
    if (shapeErrors.length) {
      return {
        report: buildScoresOnlyReport({
          assessmentId: args.assessmentId,
          createdAt: args.createdAt,
          input,
          scoring,
          narrativeStatus: "schema_failed",
          modelId,
        }),
        scoring,
        meta: { redactions, shapeErrors },
      };
    }

    const normalized = normalizeLlmNarrative(raw);
    const narrative = llmNarrativeSchema.safeParse(normalized);
    if (!narrative.success) {
      return {
        report: buildScoresOnlyReport({
          assessmentId: args.assessmentId,
          createdAt: args.createdAt,
          input,
          scoring,
          narrativeStatus: "schema_failed",
          modelId,
        }),
        scoring,
        meta: {
          redactions,
          schemaIssues: narrative.error.issues.slice(0, 8).map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
      };
    }

    return {
      report: mergeNarrativeReport({
        assessmentId: args.assessmentId,
        createdAt: args.createdAt,
        input,
        scoring,
        narrative: narrative.data,
        modelId,
      }),
      scoring,
      meta: { redactions },
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
