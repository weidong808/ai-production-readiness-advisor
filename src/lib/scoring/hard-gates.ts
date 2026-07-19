import type {
  AssessmentContext,
  AnswerMap,
  Band,
  DimensionScore,
  HardGateApplication,
} from "@/lib/scoring/types";

function dimScore(
  dimensions: DimensionScore[],
  id: string,
): number | undefined {
  return dimensions.find((d) => d.dimensionId === id)?.score;
}

function answer(answers: AnswerMap, id: string) {
  return answers[id];
}

export function applyHardGates(
  context: AssessmentContext,
  answers: AnswerMap,
  dimensions: DimensionScore[],
  scoreBand: Band,
): { finalBand: Band; hardGatesApplied: HardGateApplication[] } {
  const gates: HardGateApplication[] = [];

  const push = (gateId: string, ceiling: Band, reason: string) => {
    gates.push({ gateId, ceiling, reason });
  };

  if (
    context.interactionMode === "unclear" ||
    context.targetEnvironment === "unclear" ||
    !context.systemName.trim()
  ) {
    push(
      "HG-01",
      "Pilot Only",
      "Cannot claim production readiness with unclear scope or missing system name",
    );
  }

  const d7 = dimScore(dimensions, "D7") ?? 0;
  if (context.dataSensitivity === "regulated" && d7 < 70) {
    push(
      "HG-02",
      "Not Ready",
      "Regulated data without strong human oversight (D7 < 70)",
    );
  }

  if (
    (context.dataSensitivity === "pii" ||
      context.dataSensitivity === "regulated") &&
    answer(answers, "D2.Q2") === "D"
  ) {
    push(
      "HG-03",
      "Not Ready",
      "Sensitive data with raw PII routinely sent to models",
    );
  }

  const d3 = dimScore(dimensions, "D3") ?? 0;
  if (context.audience === "public" && d3 < 70) {
    push(
      "HG-04",
      "Pilot Only",
      "Public audience needs stronger evaluation (D3 < 70)",
    );
  }

  if (
    context.interactionMode === "autonomous_tools" &&
    (answer(answers, "D4.Q1") === "C" || answer(answers, "D4.Q1") === "D")
  ) {
    push(
      "HG-05",
      "Not Ready",
      "Autonomous tools with weak prompt-injection posture",
    );
  }

  if (
    context.interactionMode === "autonomous_tools" &&
    (answer(answers, "D4.Q3") === "C" || answer(answers, "D4.Q3") === "D")
  ) {
    push(
      "HG-06",
      "Not Ready",
      "Autonomous tools without adequate tool constraints",
    );
  }

  if (context.blastRadius === "safety_critical") {
    push(
      "HG-07",
      "Pilot Only",
      "This advisor does not green-light safety-critical AI",
    );
  }

  if (
    answer(answers, "D3.Q1") === "D" &&
    context.targetEnvironment === "production"
  ) {
    push(
      "HG-08",
      "Pilot Only",
      "No evaluation fixtures while targeting production",
    );
  }

  if (
    (answer(answers, "D7.Q1") === "C" || answer(answers, "D7.Q1") === "D") &&
    context.targetEnvironment === "production"
  ) {
    push(
      "HG-09",
      "Production with Guards",
      "No clear accountable owner for production AI outputs",
    );
  }

  if (
    answer(answers, "D5.Q1") === "D" &&
    context.targetEnvironment === "production"
  ) {
    push(
      "HG-10",
      "Pilot Only",
      "No fallback path while targeting production",
    );
  }

  const order: Band[] = [
    "Not Ready",
    "Pilot Only",
    "Production with Guards",
    "Production Ready",
  ];
  let finalBand = scoreBand;
  for (const gate of gates) {
    if (order.indexOf(gate.ceiling) < order.indexOf(finalBand)) {
      finalBand = gate.ceiling;
    }
  }

  return { finalBand, hardGatesApplied: gates };
}
