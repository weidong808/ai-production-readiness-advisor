import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scoreAssessment } from "@/lib/scoring/score";
import { bandRank } from "@/lib/scoring/bands";
import type {
  AssessmentContext,
  Band,
  OrdinalChoice,
} from "@/lib/scoring/types";

type FixtureInput = {
  scenarioId: string;
  context: AssessmentContext;
  answers: Record<string, OrdinalChoice>;
};

type FixtureExpected = {
  scenarioId: string;
  expect: {
    overallScoreMin?: number;
    scoreBand?: Band[];
    finalBand?: Band | Band[];
    finalBandMax?: Band;
    hardGatesApplied?: string[];
    hardGatesMustInclude?: string[];
    hardGatesMustIncludeAny?: string[];
  };
};

function loadJson<T>(name: string): T {
  const file = path.resolve(process.cwd(), "docs/eval/fixtures", name);
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function runScenario(id: string) {
  const input = loadJson<FixtureInput>(`${id}-input.json`);
  const expected = loadJson<FixtureExpected>(`${id}-expected.json`);
  const result = scoreAssessment({
    context: input.context,
    answers: input.answers,
  });
  return { result, expected };
}

describe("deterministic scoring fixtures S01–S06", () => {
  it("S01 healthy internal tool scores high without hard gates", () => {
    const { result, expected } = runScenario("s01");
    if (expected.expect.overallScoreMin != null) {
      expect(result.overallScore).toBeGreaterThanOrEqual(
        expected.expect.overallScoreMin,
      );
    }
    if (expected.expect.scoreBand) {
      expect(expected.expect.scoreBand).toContain(result.scoreBand);
    }
    if (Array.isArray(expected.expect.finalBand)) {
      expect(expected.expect.finalBand).toContain(result.finalBand);
    }
    expect(result.hardGatesApplied).toHaveLength(0);
  });

  it("S02 public + weak evals hits HG-04 and caps at Pilot Only", () => {
    const { result, expected } = runScenario("s02");
    for (const gate of expected.expect.hardGatesMustInclude ?? []) {
      expect(result.hardGatesApplied.map((g) => g.gateId)).toContain(gate);
    }
    if (expected.expect.finalBandMax) {
      expect(bandRank(result.finalBand)).toBeLessThanOrEqual(
        bandRank(expected.expect.finalBandMax),
      );
    }
  });

  it("S03 autonomous weak security is Not Ready", () => {
    const { result, expected } = runScenario("s03");
    const applied = result.hardGatesApplied.map((g) => g.gateId);
    const any = expected.expect.hardGatesMustIncludeAny ?? [];
    expect(any.some((g) => applied.includes(g))).toBe(true);
    expect(result.finalBand).toBe("Not Ready");
  });

  it("S04 regulated + weak oversight is Not Ready via HG-02", () => {
    const { result, expected } = runScenario("s04");
    for (const gate of expected.expect.hardGatesMustInclude ?? []) {
      expect(result.hardGatesApplied.map((g) => g.gateId)).toContain(gate);
    }
    expect(result.finalBand).toBe("Not Ready");
  });

  it("S05 raw PII is Not Ready via HG-03", () => {
    const { result, expected } = runScenario("s05");
    for (const gate of expected.expect.hardGatesMustInclude ?? []) {
      expect(result.hardGatesApplied.map((g) => g.gateId)).toContain(gate);
    }
    expect(result.finalBand).toBe("Not Ready");
  });

  it("S06 production without fixtures caps at Pilot Only via HG-08", () => {
    const { result, expected } = runScenario("s06");
    for (const gate of expected.expect.hardGatesMustInclude ?? []) {
      expect(result.hardGatesApplied.map((g) => g.gateId)).toContain(gate);
    }
    if (expected.expect.finalBandMax) {
      expect(bandRank(result.finalBand)).toBeLessThanOrEqual(
        bandRank(expected.expect.finalBandMax),
      );
    }
  });
});
