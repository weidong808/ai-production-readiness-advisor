export const BANDS = [
  "Not Ready",
  "Pilot Only",
  "Production with Guards",
  "Production Ready",
] as const;

export type Band = (typeof BANDS)[number];

export const DIMENSION_IDS = [
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
] as const;

export type DimensionId = (typeof DIMENSION_IDS)[number];

export const ORDINAL_CHOICES = ["A", "B", "C", "D"] as const;
export type OrdinalChoice = (typeof ORDINAL_CHOICES)[number];

export type Audience = "employees" | "customers" | "public" | "mixed" | "unclear";
export type InteractionMode =
  | "assistive"
  | "autonomous_tools"
  | "batch"
  | "unclear";
export type DataSensitivity = "public" | "internal" | "pii" | "regulated";
export type BlastRadius =
  | "low"
  | "recoverable"
  | "material"
  | "safety_critical";
export type TargetEnvironment =
  | "prototype"
  | "pilot"
  | "production"
  | "unclear";

export type AssessmentContext = {
  systemName: string;
  jobToBeDone: string;
  audience: Audience;
  interactionMode: InteractionMode;
  dataSensitivity: DataSensitivity;
  blastRadius: BlastRadius;
  targetEnvironment: TargetEnvironment;
};

export type AnswerMap = Record<string, OrdinalChoice>;

export type FreeTextMap = Record<string, string>;

export type AssessmentInput = {
  context: AssessmentContext;
  answers: AnswerMap;
  freeText?: FreeTextMap;
};

export type DimensionAnswer = {
  questionId: string;
  choice: OrdinalChoice;
  points: number;
};

export type DimensionScore = {
  dimensionId: DimensionId;
  name: string;
  score: number;
  band: Band;
  answers: DimensionAnswer[];
};

export type HardGateApplication = {
  gateId: string;
  ceiling: Band;
  reason: string;
};

export type ScoringResult = {
  rubricVersion: "rubric@0.1.0";
  questionsVersion: "questions@0.1.0";
  overallScore: number;
  scoreBand: Band;
  finalBand: Band;
  hardGatesApplied: HardGateApplication[];
  dimensions: DimensionScore[];
};
