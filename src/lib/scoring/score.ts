import {
  DIMENSION_META,
  QUESTIONS_VERSION,
  RUBRIC_VERSION,
  SCORED_QUESTIONS,
} from "@/lib/questions/bank";
import { applyHardGates } from "@/lib/scoring/hard-gates";
import { bandFromScore } from "@/lib/scoring/bands";
import { pointsForChoice } from "@/lib/scoring/points";
import type {
  AssessmentInput,
  DimensionId,
  DimensionScore,
  ScoringResult,
} from "@/lib/scoring/types";
import { DIMENSION_IDS } from "@/lib/scoring/types";

function scoreDimension(
  dimensionId: DimensionId,
  answers: AssessmentInput["answers"],
): DimensionScore {
  const questions = SCORED_QUESTIONS.filter((q) => q.dimensionId === dimensionId);
  const answered = questions
    .map((q) => {
      const choice = answers[q.id];
      if (!choice) return null;
      return {
        questionId: q.id,
        choice,
        points: pointsForChoice(choice),
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  const num = answered.length;
  const score =
    num === 0
      ? 0
      : Math.round(
          (100 * answered.reduce((sum, a) => sum + a.points, 0)) / (3 * num),
        );

  return {
    dimensionId,
    name: DIMENSION_META[dimensionId].name,
    score,
    band: bandFromScore(score),
    answers: answered,
  };
}

export function scoreAssessment(input: AssessmentInput): ScoringResult {
  const dimensions = DIMENSION_IDS.map((id) =>
    scoreDimension(id, input.answers),
  );

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  );
  const scoreBand = bandFromScore(overallScore);
  const { finalBand, hardGatesApplied } = applyHardGates(
    input.context,
    input.answers,
    dimensions,
    scoreBand,
  );

  return {
    rubricVersion: RUBRIC_VERSION,
    questionsVersion: QUESTIONS_VERSION,
    overallScore,
    scoreBand,
    finalBand,
    hardGatesApplied,
    dimensions,
  };
}
