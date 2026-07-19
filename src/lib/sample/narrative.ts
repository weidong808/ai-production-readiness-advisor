import type { LlmNarrative } from "@/lib/schema/narrative";

/** Pre-authored sample narrative (not from a live OpenAI call). */
export const SAMPLE_NARRATIVE: LlmNarrative = {
  executiveSummary:
    "This internal policy Q&A assistant scores well on use-case fit, data handling, and security basics, but accountability for AI outputs is still shared across teams. Hard gate HG-09 caps the result at Production with Guards until a named owner is assigned. Treat this as an advisory checklist for the next engineering and governance conversation — not certification.",
  dimensionNarratives: [
    {
      dimensionId: "D7",
      narrative:
        "Ownership is the binding constraint: without a single accountable owner for production answers, escalation paths and decision rights stay ambiguous even when tooling looks mature.",
    },
    {
      dimensionId: "D3",
      narrative:
        "Evaluation coverage is good enough for a guarded rollout, but groundedness and regression gates should be tightened before any claim of full production readiness.",
    },
    {
      dimensionId: "D5",
      narrative:
        "Reliability patterns exist, yet fallback and rollback drills should be rehearsed so a model or prompt regression does not strand employees mid-policy lookup.",
    },
  ],
  risks: [
    {
      id: "R1",
      severity: "high",
      title: "Unclear ownership of AI answers",
      description:
        "When ownership is shared, incorrect or outdated policy answers may lack a clear fixer, reviewer, and escalation path.",
      dimensionIds: ["D7"],
      citationIds: ["CORP-HUM-01"],
    },
    {
      id: "R2",
      severity: "medium",
      title: "Eval drift under content change",
      description:
        "Policy corpora change often; without stronger golden-set gates, groundedness can slip quietly after prompt or retrieval updates.",
      dimensionIds: ["D3"],
      citationIds: ["CORP-EVAL-01", "CORP-EVAL-02"],
    },
    {
      id: "R3",
      severity: "medium",
      title: "Weak failover for model outages",
      description:
        "Employees may be left without a documented fallback when the model or retrieval path fails during peak policy questions.",
      dimensionIds: ["D5"],
      citationIds: ["CORP-OPS-01"],
    },
  ],
  remediationPlan: [
    {
      id: "M1",
      priority: 1,
      title: "Name a single accountable owner",
      description:
        "Assign one role accountable for production AI outputs, with a named backup and an escalation path for disputed answers.",
      effort: "S",
      dimensionIds: ["D7"],
      citationIds: ["CORP-HUM-01"],
    },
    {
      id: "M2",
      priority: 2,
      title: "Add human review for high-impact answers",
      description:
        "Route answers that change entitlements, leave, or safety-critical policies through a human review queue before they are treated as authoritative.",
      effort: "M",
      dimensionIds: ["D7"],
      citationIds: ["CORP-HUM-02"],
    },
    {
      id: "M3",
      priority: 3,
      title: "Harden golden-set regression gates",
      description:
        "Expand fixtures for groundedness and schema validity; block prompt deploys that regress the suite.",
      effort: "M",
      dimensionIds: ["D3"],
      citationIds: ["CORP-EVAL-01", "CORP-EVAL-02"],
    },
    {
      id: "M4",
      priority: 4,
      title: "Document and drill fallbacks",
      description:
        "Publish a fallback path (search index or human helpdesk) and rehearse prompt/model rollback.",
      effort: "S",
      dimensionIds: ["D5"],
      citationIds: ["CORP-OPS-01", "CORP-OPS-02"],
    },
  ],
  citationIdsUsed: [
    "CORP-GEN-01",
    "CORP-HUM-01",
    "CORP-HUM-02",
    "CORP-EVAL-01",
    "CORP-EVAL-02",
    "CORP-OPS-01",
    "CORP-OPS-02",
  ],
};
