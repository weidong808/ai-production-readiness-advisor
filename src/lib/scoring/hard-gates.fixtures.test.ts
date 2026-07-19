import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { bandFromScore } from "@/lib/scoring/bands";
import { scoreAssessment } from "@/lib/scoring/score";
import type {
  AssessmentContext,
  AssessmentInput,
  Band,
  OrdinalChoice,
} from "@/lib/scoring/types";

type GateFixture = {
  scenarioId: string;
  context: AssessmentContext;
  answers: Record<string, OrdinalChoice>;
  freeText?: Record<string, string>;
};

type GateExpected = {
  scenarioId: string;
  expect: {
    hardGatesMustInclude: string[];
    hardGatesMustNotInclude?: string[];
    ceiling: Band;
    reason: string;
    finalBandMax: Band;
  };
};

const FIXTURE_DIR = path.resolve(process.cwd(), "docs/eval/fixtures/hard-gates");

function loadJson<T>(name: string): T {
  return JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), "utf8")) as T;
}

const GATE_IDS = [
  "hg-01",
  "hg-02",
  "hg-03",
  "hg-04",
  "hg-05",
  "hg-06",
  "hg-07",
  "hg-08",
  "hg-09",
  "hg-10",
] as const;

describe("hard-gate fixtures HG-01…HG-10", () => {
  it.each(GATE_IDS)("%s fires with stable ceiling and reason", (id) => {
    const input = loadJson<GateFixture>(`${id}-input.json`);
    const expected = loadJson<GateExpected>(`${id}-expected.json`);
    const result = scoreAssessment({
      context: input.context,
      answers: input.answers,
      freeText: input.freeText,
    });

    const applied = result.hardGatesApplied;
    const ids = applied.map((g) => g.gateId);

    for (const gateId of expected.expect.hardGatesMustInclude) {
      expect(ids).toContain(gateId);
      const gate = applied.find((g) => g.gateId === gateId)!;
      expect(gate.ceiling).toBe(expected.expect.ceiling);
      expect(gate.reason).toBe(expected.expect.reason);
    }

    for (const gateId of expected.expect.hardGatesMustNotInclude ?? []) {
      expect(ids).not.toContain(gateId);
    }

    expect(result.finalBand).toBe(expected.expect.finalBandMax);
  });
});

describe("band threshold boundaries (bandFromScore)", () => {
  it.each([
    [0, "Not Ready"],
    [44, "Not Ready"],
    [45, "Pilot Only"],
    [69, "Pilot Only"],
    [70, "Production with Guards"],
    [84, "Production with Guards"],
    [85, "Production Ready"],
    [100, "Production Ready"],
  ] as const)("score %i → %s", (score, band) => {
    expect(bandFromScore(score)).toBe(band);
  });
});

describe("band landing fixtures (full assessment)", () => {
  it.each(["band-not-ready", "band-pilot", "band-guards", "band-ready"] as const)(
    "%s lands in the expected scoreBand",
    (id) => {
      const input = loadJson<GateFixture>(`${id}-input.json`);
      const expected = loadJson<{
        expect: { scoreBand: Band; finalBand?: Band };
      }>(`${id}-expected.json`);
      const result = scoreAssessment({
        context: input.context,
        answers: input.answers,
      });
      expect(result.scoreBand).toBe(expected.expect.scoreBand);
      if (expected.expect.finalBand) {
        expect(result.finalBand).toBe(expected.expect.finalBand);
      }
    },
  );
});

describe("injection free-text cannot raise band (scoring path)", () => {
  it("inj-01: prompt-injection free text leaves band and gates unchanged", () => {
    const input = loadJson<GateFixture & { freeText: Record<string, string> }>(
      "inj-01-input.json",
    );
    const expected = loadJson<{
      expect: {
        finalBand: Band;
        hardGatesMustInclude: string[];
        freeTextMustNotAffectBand: boolean;
      };
    }>("inj-01-expected.json");

    const base: AssessmentInput = {
      context: input.context,
      answers: input.answers,
    };
    const withInjection: AssessmentInput = {
      ...base,
      freeText: input.freeText,
    };

    const a = scoreAssessment(base);
    const b = scoreAssessment(withInjection);

    expect(b.finalBand).toBe(a.finalBand);
    expect(b.overallScore).toBe(a.overallScore);
    expect(b.scoreBand).toBe(a.scoreBand);
    expect(b.hardGatesApplied.map((g) => g.gateId)).toEqual(
      a.hardGatesApplied.map((g) => g.gateId),
    );
    expect(b.finalBand).toBe(expected.expect.finalBand);
    for (const gate of expected.expect.hardGatesMustInclude) {
      expect(b.hardGatesApplied.map((g) => g.gateId)).toContain(gate);
    }
    expect(expected.expect.freeTextMustNotAffectBand).toBe(true);
  });
});
