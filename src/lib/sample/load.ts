import sampleReportJson from "../../../content/samples/sample-report.json";
import { readinessReportSchema } from "@/lib/schema/narrative";
import type { ReadinessReport } from "@/lib/schema/narrative";
import { SAMPLE_ASSESSMENT_INPUT } from "@/lib/sample/input";
import { scoreAssessment } from "@/lib/scoring/score";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

export function getSampleReport(): ReadinessReport {
  return readinessReportSchema.parse(sampleReportJson);
}

export function getSampleAssessmentInput(): AssessmentInput {
  return SAMPLE_ASSESSMENT_INPUT;
}

export function getSampleScoringResult(): ScoringResult {
  return scoreAssessment(SAMPLE_ASSESSMENT_INPUT);
}
