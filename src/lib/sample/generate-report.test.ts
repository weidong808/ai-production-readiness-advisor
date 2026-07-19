import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { mergeNarrativeReport } from "@/lib/ai/merge";
import { readinessReportSchema } from "@/lib/schema/narrative";
import { SAMPLE_ASSESSMENT_INPUT } from "@/lib/sample/input";
import { SAMPLE_NARRATIVE } from "@/lib/sample/narrative";
import { scoreAssessment } from "@/lib/scoring/score";

const SAMPLE_PATH = path.resolve(
  process.cwd(),
  "content/samples/sample-report.json",
);

describe("sample report artifact", () => {
  it("committed JSON matches merge of sample input + narrative", () => {
    const scoring = scoreAssessment(SAMPLE_ASSESSMENT_INPUT);
    const report = mergeNarrativeReport({
      assessmentId: "00000000-0000-4000-8000-0000000000s1",
      createdAt: "2026-07-19T12:00:00.000Z",
      input: SAMPLE_ASSESSMENT_INPUT,
      scoring,
      narrative: SAMPLE_NARRATIVE,
      modelId: "sample-pregenerated",
    });

    const parsed = readinessReportSchema.parse(report);
    expect(parsed.finalBand).toBe("Production with Guards");
    expect(parsed.hardGatesApplied.map((g) => g.gateId)).toContain("HG-09");
    expect(parsed.model.narrativeStatus).toBe("ok");

    if (process.env.GENERATE_SAMPLE === "1") {
      mkdirSync(path.dirname(SAMPLE_PATH), { recursive: true });
      writeFileSync(SAMPLE_PATH, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    }

    const committed = readinessReportSchema.parse(
      JSON.parse(readFileSync(SAMPLE_PATH, "utf8")),
    );
    expect(committed).toEqual(parsed);
  });
});
