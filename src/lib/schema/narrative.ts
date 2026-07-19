import { z } from "zod";
import { assessmentInputSchema } from "@/lib/schema/assessment";
import { BANDS, DIMENSION_IDS } from "@/lib/scoring/types";

export const llmNarrativeSchema = z.object({
  executiveSummary: z.string().min(1).max(4000),
  dimensionNarratives: z
    .array(
      z.object({
        dimensionId: z.enum(DIMENSION_IDS),
        narrative: z.string().min(1).max(2000),
      }),
    )
    .max(8),
  risks: z
    .array(
      z.object({
        id: z.string().min(1).max(32),
        severity: z.enum(["critical", "high", "medium", "low"]),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(2000),
        dimensionIds: z.array(z.enum(DIMENSION_IDS)).max(8),
        citationIds: z.array(z.string().max(64)).max(12),
      }),
    )
    .max(12),
  remediationPlan: z
    .array(
      z.object({
        id: z.string().min(1).max(32),
        priority: z.number().int().min(1).max(99),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(2000),
        effort: z.enum(["S", "M", "L"]),
        dimensionIds: z.array(z.enum(DIMENSION_IDS)).max(8),
        citationIds: z.array(z.string().max(64)).max(12),
      }),
    )
    .max(12),
  citationIdsUsed: z.array(z.string().max(64)).max(24),
});

export const narrativeRequestSchema = z.object({
  assessmentId: z.string().uuid().optional(),
  input: assessmentInputSchema,
});

export const readinessReportSchema = z.object({
  schemaVersion: z.literal("report@0.1.0"),
  context: z.object({
    assessmentId: z.string(),
    createdAt: z.string(),
    rubricVersion: z.string(),
    questionsVersion: z.string(),
    corpusVersion: z.string(),
    systemName: z.string(),
    jobToBeDone: z.string(),
    audience: z.string(),
    interactionMode: z.string(),
    dataSensitivity: z.string(),
    blastRadius: z.string(),
    targetEnvironment: z.string(),
  }),
  overallScore: z.number(),
  scoreBand: z.enum(BANDS),
  finalBand: z.enum(BANDS),
  hardGatesApplied: z.array(
    z.object({
      gateId: z.string(),
      ceiling: z.enum(BANDS),
      reason: z.string(),
    }),
  ),
  dimensions: z.array(
    z.object({
      dimensionId: z.enum(DIMENSION_IDS),
      name: z.string(),
      score: z.number(),
      band: z.enum(BANDS),
      answers: z.array(
        z.object({
          questionId: z.string(),
          choice: z.enum(["A", "B", "C", "D"]),
          points: z.number(),
        }),
      ),
    }),
  ),
  executiveSummary: z.string(),
  dimensionNarratives: z.array(
    z.object({
      dimensionId: z.enum(DIMENSION_IDS),
      narrative: z.string(),
    }),
  ),
  risks: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(["critical", "high", "medium", "low"]),
      title: z.string(),
      description: z.string(),
      dimensionIds: z.array(z.enum(DIMENSION_IDS)),
      citationIds: z.array(z.string()),
    }),
  ),
  remediationPlan: z.array(
    z.object({
      id: z.string(),
      priority: z.number(),
      title: z.string(),
      description: z.string(),
      effort: z.enum(["S", "M", "L"]),
      dimensionIds: z.array(z.enum(DIMENSION_IDS)),
      citationIds: z.array(z.string()),
    }),
  ),
  citations: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      source: z.string(),
      chunkId: z.string(),
      url: z.string().nullable(),
    }),
  ),
  disclaimer: z.string(),
  qualityFlags: z.array(z.string()).default([]),
  model: z.object({
    provider: z.string(),
    modelId: z.string(),
    promptVersion: z.string(),
    narrativeStatus: z.enum(["ok", "unavailable", "schema_failed"]),
  }),
});

export type ReadinessReport = z.infer<typeof readinessReportSchema>;
export type LlmNarrative = z.infer<typeof llmNarrativeSchema>;
