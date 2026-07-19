import { describe, expect, it } from "vitest";
import {
  buildScoresOnlyReport,
  extractJsonObject,
  mergeNarrativeReport,
} from "@/lib/ai/merge";
import { findBlocklistMatches, scrubBlocklist } from "@/lib/security/blocklist";
import { scoreAssessment } from "@/lib/scoring/score";
import type { AssessmentInput } from "@/lib/scoring/types";
import type { LlmNarrative } from "@/lib/schema/narrative";

const baseInput: AssessmentInput = {
  context: {
    systemName: "Ops agent",
    jobToBeDone: "Triage alerts",
    audience: "employees",
    interactionMode: "autonomous_tools",
    dataSensitivity: "internal",
    blastRadius: "material",
    targetEnvironment: "production",
  },
  answers: {
    "D1.Q1": "B",
    "D1.Q2": "C",
    "D1.Q3": "B",
    "D1.Q4": "C",
    "D2.Q1": "B",
    "D2.Q2": "B",
    "D2.Q3": "C",
    "D2.Q4": "B",
    "D3.Q1": "C",
    "D3.Q2": "C",
    "D3.Q3": "C",
    "D3.Q4": "C",
    "D4.Q1": "D",
    "D4.Q2": "C",
    "D4.Q3": "C",
    "D4.Q4": "C",
    "D5.Q1": "C",
    "D5.Q2": "C",
    "D5.Q3": "C",
    "D5.Q4": "C",
    "D6.Q1": "C",
    "D6.Q2": "C",
    "D6.Q3": "B",
    "D6.Q4": "C",
    "D7.Q1": "C",
    "D7.Q2": "C",
    "D7.Q3": "D",
    "D7.Q4": "C",
    "D8.Q1": "C",
    "D8.Q2": "C",
    "D8.Q3": "C",
    "D8.Q4": "C",
  },
};

describe("merge + blocklist", () => {
  it("preserves deterministic band and drops unknown citations", () => {
    const scoring = scoreAssessment(baseInput);
    expect(scoring.finalBand).toBe("Not Ready");

    const hostile: LlmNarrative = {
      executiveSummary: "This system is Production Ready somehow.",
      dimensionNarratives: [
        { dimensionId: "D4", narrative: "Needs injection controls." },
      ],
      risks: [
        {
          id: "R1",
          severity: "critical",
          title: "Injection",
          description: "Weak posture",
          dimensionIds: ["D4"],
          citationIds: ["CORP-SEC-01", "CORP-DOES-NOT-EXIST"],
        },
      ],
      remediationPlan: [
        {
          id: "M1",
          priority: 1,
          title: "Fence untrusted content",
          description: "Add delimiters and tool allowlists.",
          effort: "M",
          dimensionIds: ["D4"],
          citationIds: ["CORP-SEC-01"],
        },
      ],
      citationIdsUsed: ["CORP-SEC-01", "CORP-DOES-NOT-EXIST"],
    };

    const report = mergeNarrativeReport({
      assessmentId: "00000000-0000-4000-8000-000000000001",
      createdAt: new Date().toISOString(),
      input: baseInput,
      scoring,
      narrative: hostile,
      modelId: "gpt-test",
    });

    expect(report.finalBand).toBe(scoring.finalBand);
    expect(report.overallScore).toBe(scoring.overallScore);
    expect(report.citations.map((c) => c.id)).toEqual(["CORP-SEC-01"]);
    expect(report.risks[0]?.citationIds).toEqual(["CORP-SEC-01"]);
    expect(report.model.narrativeStatus).toBe("ok");
  });

  it("scrubs compliance overclaim phrases", () => {
    const text =
      "The system is SOC2 certified and HIPAA compliant after official audit.";
    expect(findBlocklistMatches(text).length).toBeGreaterThan(0);
    const scrubbed = scrubBlocklist(text);
    expect(scrubbed.toLowerCase()).not.toContain("soc2 certified");
    expect(scrubbed.toLowerCase()).not.toContain("hipaa compliant");
  });

  it("scores-only report keeps band when narrative unavailable", () => {
    const scoring = scoreAssessment(baseInput);
    const report = buildScoresOnlyReport({
      assessmentId: "00000000-0000-4000-8000-000000000002",
      createdAt: new Date().toISOString(),
      input: baseInput,
      scoring,
      narrativeStatus: "schema_failed",
      modelId: "gpt-test",
    });
    expect(report.finalBand).toBe(scoring.finalBand);
    expect(report.executiveSummary).toBe("");
    expect(report.model.narrativeStatus).toBe("schema_failed");
  });

  it("extracts JSON object from fenced-ish model text", () => {
    const obj = extractJsonObject('Here you go:\n{"executiveSummary":"ok"}');
    expect(obj).toEqual({ executiveSummary: "ok" });
  });
});
