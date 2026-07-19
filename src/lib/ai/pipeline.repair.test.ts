import { describe, expect, it, vi } from "vitest";
import { runNarrativePipeline } from "@/lib/ai/pipeline";
import type { AssessmentInput } from "@/lib/scoring/types";

const input: AssessmentInput = {
  context: {
    systemName: "Repair probe",
    jobToBeDone: "Validate schema repair",
    audience: "employees",
    interactionMode: "assistive",
    dataSensitivity: "internal",
    blastRadius: "low",
    targetEnvironment: "pilot",
  },
  answers: {},
};

const validNarrative = {
  executiveSummary: "Scores apply; narrative was repaired after a schema miss.",
  dimensionNarratives: [
    { dimensionId: "D1", narrative: "Clarify success metrics." },
  ],
  risks: [
    {
      id: "R1",
      severity: "medium",
      title: "Thin context",
      description: "Few answers were provided in this probe.",
      dimensionIds: ["D1"],
      citationIds: ["CORP-USE-01"],
    },
  ],
  remediationPlan: [
    {
      id: "M1",
      priority: 1,
      title: "Complete the assessment",
      description: "Answer all dimensions before a production decision.",
      effort: "S",
      dimensionIds: ["D1"],
      citationIds: ["CORP-USE-01"],
    },
  ],
  citationIdsUsed: ["CORP-USE-01", "CORP-GEN-01"],
};

describe("narrative schema repair", () => {
  it("retries once with repairHint and returns ok + repaired meta", async () => {
    const generate = vi
      .fn()
      .mockResolvedValueOnce({
        modelId: "mock",
        text: JSON.stringify({ executiveSummary: 123 }),
      })
      .mockResolvedValueOnce({
        modelId: "mock-repaired",
        text: JSON.stringify(validNarrative),
      });

    const result = await runNarrativePipeline({
      assessmentId: "00000000-0000-4000-8000-0000000000r1",
      createdAt: "2026-07-19T12:00:00.000Z",
      input,
      modelIdFallback: "mock",
      generate,
    });

    expect(generate).toHaveBeenCalledTimes(2);
    expect(generate.mock.calls[1][0].repairHint).toMatch(/schema|JSON|shape/i);
    expect(result.report.model.narrativeStatus).toBe("ok");
    expect(result.meta.repaired).toBe(true);
    expect(result.report.executiveSummary).toContain("repaired");
  });

  it("falls back to schema_failed after one failed repair", async () => {
    const generate = vi.fn().mockResolvedValue({
      modelId: "mock",
      text: "not-json",
    });

    const result = await runNarrativePipeline({
      assessmentId: "00000000-0000-4000-8000-0000000000r2",
      createdAt: "2026-07-19T12:00:00.000Z",
      input,
      modelIdFallback: "mock",
      generate,
    });

    expect(generate).toHaveBeenCalledTimes(2);
    expect(result.report.model.narrativeStatus).toBe("schema_failed");
    expect(result.meta.repaired).toBeUndefined();
    expect(result.meta.shapeErrors).toContain("invalid_json");
  });
});
