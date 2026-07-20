import type { DimensionId, OrdinalChoice } from "@/lib/scoring/types";

export type ChoiceDef = {
  value: OrdinalChoice;
  label: string;
};

export type ScoredQuestion = {
  id: string;
  dimensionId: DimensionId;
  prompt: string;
  choices: ChoiceDef[];
};

export type ContextField =
  | {
      id: string;
      kind: "text";
      label: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      id: string;
      kind: "select";
      label: string;
      required?: boolean;
      options: { value: string; label: string }[];
    };

export const RUBRIC_VERSION = "rubric@0.1.0" as const;
export const QUESTIONS_VERSION = "questions@0.1.0" as const;

export const DIMENSION_META: Record<
  DimensionId,
  { name: string; summary: string }
> = {
  D1: {
    name: "Use-case & risk fit",
    summary: "Clarity of job-to-be-done, misuse, and blast radius fit",
  },
  D2: {
    name: "Data & privacy",
    summary: "Data inventory, PII minimization, retention, provider training",
  },
  D3: {
    name: "Evaluation quality",
    summary: "Fixtures, regression gates, groundedness, online feedback",
  },
  D4: {
    name: "Security & abuse",
    summary: "Prompt injection, authz, tool constraints, supply chain",
  },
  D5: {
    name: "Reliability & ops",
    summary: "Fallbacks, rollback, dependency failure, latency budgets",
  },
  D6: {
    name: "Observability",
    summary: "Tracing, version logging, privacy-safe logs, alerting",
  },
  D7: {
    name: "Human oversight",
    summary: "Accountability, escalation, review, user-facing limits",
  },
  D8: {
    name: "Cost & performance",
    summary: "Caps, caching, model tiering, latency fit",
  },
};

const ordinal = (
  a: string,
  b: string,
  c: string,
  d: string,
): ChoiceDef[] => [
  { value: "A", label: a },
  { value: "B", label: b },
  { value: "C", label: c },
  { value: "D", label: d },
];

export const CONTEXT_FIELDS: ContextField[] = [
  {
    id: "systemName",
    kind: "text",
    label: "What are you assessing?",
    placeholder: "e.g. Internal policy Q&A assistant",
    required: true,
  },
  {
    id: "jobToBeDone",
    kind: "text",
    label: "One-sentence job-to-be-done",
    placeholder: "Help employees find approved policy answers with citations",
    required: true,
  },
  {
    id: "audience",
    kind: "select",
    label: "Primary user audience",
    required: true,
    options: [
      { value: "employees", label: "Employees (internal)" },
      { value: "customers", label: "Authenticated customers" },
      { value: "public", label: "Public / anonymous" },
      { value: "mixed", label: "Mixed" },
      { value: "unclear", label: "Unclear" },
    ],
  },
  {
    id: "interactionMode",
    kind: "select",
    label: "AI interaction mode",
    required: true,
    options: [
      { value: "assistive", label: "Assistive (human always acts)" },
      { value: "autonomous_tools", label: "Autonomous actions with tools" },
      { value: "batch", label: "Batch / offline" },
      { value: "unclear", label: "Unclear" },
    ],
  },
  {
    id: "dataSensitivity",
    kind: "select",
    label: "Data sensitivity",
    required: true,
    options: [
      { value: "public", label: "Public" },
      { value: "internal", label: "Internal" },
      { value: "pii", label: "PII / sensitive" },
      { value: "regulated", label: "Regulated (health / finance / gov)" },
    ],
  },
  {
    id: "blastRadius",
    kind: "select",
    label: "Blast radius if wrong",
    required: true,
    options: [
      { value: "low", label: "Low annoyance" },
      { value: "recoverable", label: "Recoverable user harm" },
      { value: "material", label: "Material business / legal risk" },
      { value: "safety_critical", label: "Safety-critical" },
    ],
  },
  {
    id: "targetEnvironment",
    kind: "select",
    label: "Target environment",
    required: true,
    options: [
      { value: "prototype", label: "Prototype" },
      { value: "pilot", label: "Limited pilot" },
      { value: "production", label: "Production" },
      { value: "unclear", label: "Unclear" },
    ],
  },
];

export const SCORED_QUESTIONS: ScoredQuestion[] = [
  {
    id: "D1.Q1",
    dimensionId: "D1",
    prompt: "Is the job-to-be-done crisp enough to evaluate success?",
    choices: ordinal(
      "Measurable success criteria",
      "Clear but qualitative",
      "Fuzzy",
      "AI for AI’s sake",
    ),
  },
  {
    id: "D1.Q2",
    dimensionId: "D1",
    prompt: "Have misuse / dual-use cases been listed?",
    choices: ordinal(
      "Documented + owners",
      "Informal list",
      "Acknowledged only",
      "Not considered",
    ),
  },
  {
    id: "D1.Q3",
    dimensionId: "D1",
    prompt: "Is the AI the right tool vs deterministic software?",
    choices: ordinal(
      "Evaluated alternatives",
      "Mostly justified",
      "Assumed",
      "Unknown",
    ),
  },
  {
    id: "D1.Q4",
    dimensionId: "D1",
    prompt: "Is failure acceptable for this use case?",
    choices: ordinal(
      "Yes, with UX for failure",
      "Mostly",
      "Rarely",
      "Never, but no controls",
    ),
  },
  {
    id: "D2.Q1",
    dimensionId: "D2",
    prompt: "Are training / fine-tune / RAG data sources inventory’d?",
    choices: ordinal(
      "Inventory + owners",
      "Partial",
      "Unknown mix",
      "Includes unvetted sensitive data",
    ),
  },
  {
    id: "D2.Q2",
    dimensionId: "D2",
    prompt: "Is PII minimized before model calls?",
    choices: ordinal(
      "Systematic redaction / minimization",
      "Partial",
      "Ad hoc",
      "Raw PII routinely sent",
    ),
  },
  {
    id: "D2.Q3",
    dimensionId: "D2",
    prompt: "Are retention & deletion rules defined for prompts/logs?",
    choices: ordinal(
      "Documented + enforced",
      "Documented only",
      "Unclear",
      "Indefinite retention of raw content",
    ),
  },
  {
    id: "D2.Q4",
    dimensionId: "D2",
    prompt: "Is user content used for provider training?",
    choices: ordinal(
      "Contractually excluded / self-hosted",
      "Unknown but gated",
      "Default provider settings",
      "Opted into training on user data",
    ),
  },
  {
    id: "D3.Q1",
    dimensionId: "D3",
    prompt: "Do you have a golden / fixture set for critical behaviors?",
    choices: ordinal(
      "Versioned + CI",
      "Exists, manual",
      "A few examples",
      "None",
    ),
  },
  {
    id: "D3.Q2",
    dimensionId: "D3",
    prompt: "Are regression checks run before prompt/model changes?",
    choices: ordinal("Required gate", "Sometimes", "Rarely", "Never"),
  },
  {
    id: "D3.Q3",
    dimensionId: "D3",
    prompt:
      "Do you measure groundedness / citation / schema validity (as relevant)?",
    choices: ordinal("Automated metrics", "Spot checks", "Vibe checks", "None"),
  },
  {
    id: "D3.Q4",
    dimensionId: "D3",
    prompt: "Is there an online quality / feedback loop after launch?",
    choices: ordinal(
      "Monitored + reviewed",
      "Metrics only",
      "Informal reports",
      "None",
    ),
  },
  {
    id: "D4.Q1",
    dimensionId: "D4",
    prompt: "Prompt-injection / untrusted content handling?",
    choices: ordinal(
      "Threat model + mitigations tested",
      "Basic delimiters / filters",
      "Assumed safe",
      "Model sees raw untrusted content with tools",
    ),
  },
  {
    id: "D4.Q2",
    dimensionId: "D4",
    prompt: "AuthN/AuthZ for AI actions and data access?",
    choices: ordinal(
      "Least privilege + audited",
      "Standard app auth only",
      "Partial",
      "Model can reach broad data/tools",
    ),
  },
  {
    id: "D4.Q3",
    dimensionId: "D4",
    prompt: "Tool / function calling constraints?",
    choices: ordinal(
      "Allowlist + confirmation for side effects",
      "Allowlist only (or N/A — no tools)",
      "Broad tools",
      "Unconstrained side effects",
    ),
  },
  {
    id: "D4.Q4",
    dimensionId: "D4",
    prompt: "Secrets & supply chain for models/prompts/deps?",
    choices: ordinal(
      "Managed secrets + pinned deps",
      "Partial",
      "Secrets in prompts/repos risk",
      "Unknown",
    ),
  },
  {
    id: "D5.Q1",
    dimensionId: "D5",
    prompt: "Defined fallback when model/provider fails?",
    choices: ordinal(
      "Graceful degrade tested",
      "Basic error UX",
      "Retry only",
      "Hard fail / blank",
    ),
  },
  {
    id: "D5.Q2",
    dimensionId: "D5",
    prompt: "Can you roll back model/prompt/config quickly?",
    choices: ordinal(
      "One-click / flagged",
      "Redeploy",
      "Hard",
      "No versioning",
    ),
  },
  {
    id: "D5.Q3",
    dimensionId: "D5",
    prompt: "Dependency & quota failure modes understood?",
    choices: ordinal("Runbooks", "Known, informal", "Hope", "Unknown"),
  },
  {
    id: "D5.Q4",
    dimensionId: "D5",
    prompt: "Load / latency expectations documented?",
    choices: ordinal("Budgets + tests", "Targets only", "Unknown", "Ignored"),
  },
  {
    id: "D6.Q1",
    dimensionId: "D6",
    prompt: "Can you trace a single request end-to-end?",
    choices: ordinal(
      "Trace ids across AI + app",
      "App logs only",
      "Partial",
      "No",
    ),
  },
  {
    id: "D6.Q2",
    dimensionId: "D6",
    prompt: "Are prompt/template/model versions recorded per request?",
    choices: ordinal("Always", "Often", "Rarely", "Never"),
  },
  {
    id: "D6.Q3",
    dimensionId: "D6",
    prompt: "Privacy-safe logging (no raw secrets/PII by default)?",
    choices: ordinal(
      "Redaction policy enforced",
      "Best effort",
      "Logs everything",
      "Unknown",
    ),
  },
  {
    id: "D6.Q4",
    dimensionId: "D6",
    prompt: "Alerting on quality/safety/cost anomalies?",
    choices: ordinal(
      "Alerted + owned",
      "Dashboards only",
      "None",
      "None and high traffic",
    ),
  },
  {
    id: "D7.Q1",
    dimensionId: "D7",
    prompt: "Who is accountable for AI outputs in production?",
    choices: ordinal("Named owner", "Team vague", "“The model”", "Nobody"),
  },
  {
    id: "D7.Q2",
    dimensionId: "D7",
    prompt: "Escalation path when AI is wrong/harmful?",
    choices: ordinal(
      "Documented + practiced",
      "Documented",
      "Improvised",
      "None",
    ),
  },
  {
    id: "D7.Q3",
    dimensionId: "D7",
    prompt: "Human review for high-impact actions?",
    choices: ordinal(
      "Required",
      "Sampling",
      "None needed & justified",
      "None though impact is high",
    ),
  },
  {
    id: "D7.Q4",
    dimensionId: "D7",
    prompt: "User-facing uncertainty / limitations communicated?",
    choices: ordinal(
      "Clear UX + docs",
      "Partial",
      "Overconfident UX",
      "Hidden",
    ),
  },
  {
    id: "D8.Q1",
    dimensionId: "D8",
    prompt: "Token/cost budget per request/user/day?",
    choices: ordinal("Enforced caps", "Monitored", "Unknown", "Unlimited"),
  },
  {
    id: "D8.Q2",
    dimensionId: "D8",
    prompt: "Caching / dedup for repeated prompts?",
    choices: ordinal(
      "Yes where safe",
      "Partial",
      "No",
      "No and high volume",
    ),
  },
  {
    id: "D8.Q3",
    dimensionId: "D8",
    prompt: "Model tiering (cheap vs strong) by task?",
    choices: ordinal(
      "Deliberate",
      "Single model ok for scale",
      "Oversized model everywhere",
      "Unknown spend",
    ),
  },
  {
    id: "D8.Q4",
    dimensionId: "D8",
    prompt: "Latency budget compatible with UX?",
    choices: ordinal(
      "Measured p95",
      "Rough",
      "Unknown",
      "Known breach",
    ),
  },
];

export const FREE_TEXT_FIELDS = [
  {
    id: "X.1",
    label: "Top concern you already worry about (optional)",
  },
  {
    id: "X.2",
    label: "Links to design docs / eval notes (optional, stored locally only)",
  },
  {
    id: "X.3",
    label: "Anything the questions missed (optional)",
  },
] as const;

export function questionsForDimension(dimensionId: DimensionId) {
  return SCORED_QUESTIONS.filter((q) => q.dimensionId === dimensionId);
}
