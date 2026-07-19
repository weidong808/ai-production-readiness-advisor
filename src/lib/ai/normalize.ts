import { DIMENSION_IDS, type DimensionId } from "@/lib/scoring/types";

const DIM_SET = new Set<string>(DIMENSION_IDS);

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asDimIds(v: unknown): DimensionId[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is DimensionId => typeof x === "string" && DIM_SET.has(x));
}

function asCitationIds(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.length > 0).slice(0, 12);
}

function asSeverity(v: unknown): "critical" | "high" | "medium" | "low" {
  const s = asString(v, "medium").toLowerCase();
  if (s === "critical" || s === "high" || s === "medium" || s === "low") return s;
  return "medium";
}

function asEffort(v: unknown): "S" | "M" | "L" {
  const s = asString(v, "M").toUpperCase();
  if (s === "S" || s === "M" || s === "L") return s;
  return "M";
}

/** Best-effort cleanup before Zod validation. */
export function normalizeLlmNarrative(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;

  const dimensionNarratives = Array.isArray(o.dimensionNarratives)
    ? o.dimensionNarratives
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const d = item as Record<string, unknown>;
          const dimensionId = asString(d.dimensionId);
          if (!DIM_SET.has(dimensionId)) return null;
          return {
            dimensionId,
            narrative: asString(d.narrative).slice(0, 2000),
          };
        })
        .filter(Boolean)
    : [];

  const risks = Array.isArray(o.risks)
    ? o.risks
        .map((item, idx) => {
          if (!item || typeof item !== "object") return null;
          const r = item as Record<string, unknown>;
          const title = asString(r.title);
          const description = asString(r.description);
          if (!title || !description) return null;
          return {
            id: asString(r.id, `R${idx + 1}`).slice(0, 32),
            severity: asSeverity(r.severity),
            title: title.slice(0, 200),
            description: description.slice(0, 2000),
            dimensionIds: asDimIds(r.dimensionIds),
            citationIds: asCitationIds(r.citationIds),
          };
        })
        .filter(Boolean)
    : [];

  const remediationPlan = Array.isArray(o.remediationPlan)
    ? o.remediationPlan
        .map((item, idx) => {
          if (!item || typeof item !== "object") return null;
          const m = item as Record<string, unknown>;
          const title = asString(m.title);
          const description = asString(m.description);
          if (!title || !description) return null;
          const priorityRaw = m.priority;
          const priority =
            typeof priorityRaw === "number"
              ? priorityRaw
              : Number.parseInt(asString(priorityRaw, String(idx + 1)), 10);
          return {
            id: asString(m.id, `M${idx + 1}`).slice(0, 32),
            priority: Number.isFinite(priority) ? Math.min(99, Math.max(1, priority)) : idx + 1,
            title: title.slice(0, 200),
            description: description.slice(0, 2000),
            effort: asEffort(m.effort),
            dimensionIds: asDimIds(m.dimensionIds),
            citationIds: asCitationIds(m.citationIds),
          };
        })
        .filter(Boolean)
    : [];

  return {
    executiveSummary: asString(o.executiveSummary).slice(0, 4000),
    dimensionNarratives,
    risks,
    remediationPlan,
    citationIdsUsed: asCitationIds(o.citationIdsUsed),
  };
}
