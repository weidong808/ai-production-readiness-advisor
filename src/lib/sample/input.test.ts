import { describe, expect, it } from "vitest";
import { SAMPLE_ASSESSMENT_INPUT } from "@/lib/sample/input";
import { scoreAssessment } from "@/lib/scoring/score";

describe("sample assessment fixture", () => {
  it("lands on Production with Guards via HG-09", () => {
    const result = scoreAssessment(SAMPLE_ASSESSMENT_INPUT);
    expect(result.scoreBand).toMatch(/Production/);
    expect(result.finalBand).toBe("Production with Guards");
    expect(result.hardGatesApplied.map((g) => g.gateId)).toContain("HG-09");
    expect(result.overallScore).toBe(86);
  });
});

