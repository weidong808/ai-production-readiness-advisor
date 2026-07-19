/** Fail closed when the model returns clearly malformed field types. */
export function rawNarrativeHasFatalShapeErrors(raw: unknown): string[] {
  if (!raw || typeof raw !== "object") {
    return ["root_not_object"];
  }
  const o = raw as Record<string, unknown>;
  const errors: string[] = [];

  if ("risks" in o && !Array.isArray(o.risks)) {
    errors.push("risks_not_array");
  }
  if ("remediationPlan" in o && !Array.isArray(o.remediationPlan)) {
    errors.push("remediationPlan_not_array");
  }
  if ("dimensionNarratives" in o && !Array.isArray(o.dimensionNarratives)) {
    errors.push("dimensionNarratives_not_array");
  }
  if ("citationIdsUsed" in o && !Array.isArray(o.citationIdsUsed)) {
    errors.push("citationIdsUsed_not_array");
  }
  if (
    "executiveSummary" in o &&
    o.executiveSummary !== undefined &&
    typeof o.executiveSummary !== "string"
  ) {
    errors.push("executiveSummary_not_string");
  }

  return errors;
}
