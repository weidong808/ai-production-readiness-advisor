# App #3 Handoff — AI Production Readiness Advisor

**Status:** Working synthesis (owner summary reconstructed into repo)  
**Date:** July 2026  
**Audience:** Cursor + Cowork agents  
**Rule:** Complete discovery deliverables before substantial coding.

> If the original Cowork handoff file becomes available, replace this synthesis and reconcile diffs in `docs/discovery/01-product-decisions.md`.

---

## 1. Product purpose

Help technology leaders, architects, and senior engineers quickly assess whether an AI feature/system is ready for production, and leave with:

1. A **readiness band** (deterministic rules over scored dimensions)
2. **Dimension scores** with rationale
3. **Top risks** and evidence gaps
4. A **prioritized remediation plan** grounded in a curated reference corpus

Strategic positioning (portfolio):

- Demonstrates enterprise-relevant AI engineering judgment
- Contrasts with consumer wellness apps (RetireCheck / SleepCheck)
- Showcases structured outputs, RAG, evals, cost controls, and security hygiene
- Remains an **educational showcase**, not a certification product

## 2. Comparison with two alternative concepts

| Concept | Pros | Cons | Decision |
|---------|------|------|----------|
| **A. AI Production Readiness Advisor** (this) | Strong hiring/architecture signal; clear structured output; RAG + eval story | Needs careful “not an audit” framing; corpus curation effort | **Selected** |
| **B. HabitCheck / Better Living #3** | Fits Check family; shared tracking engine path | Overlaps wellness narrative already covered by SleepCheck; weaker enterprise signal for App #3 | Deferred (separate candidate) |
| **C. Generic AI chatbot “copilot for ops”** | Fast to prototype | Weak differentiation; hard to evaluate; looks like wrapperware | Rejected |

## 3. Target users and sample scenarios

**Primary users**

- Staff/principal engineers owning an AI feature launch
- Solution / enterprise architects reviewing AI risk
- Engineering managers preparing a go/no-go discussion
- Hiring audiences evaluating the builder’s judgment (via case study)

**Sample scenarios**

1. Internal RAG assistant about to ship to employees  
2. Customer-facing LLM support summarizer  
3. Batch document classification pipeline  
4. Code-generation helper inside a developer portal  
5. Wellness or finance advisory feature (high sensitivity)  

## 4. MVP scope

### In

- Guided multi-step assessment (context → dimensions → review → report)
- Eight production-readiness dimensions with scored answers
- Deterministic readiness bands from scores + hard gates
- Structured report (JSON schema + human-readable view)
- RAG citations from a small curated corpus
- Export report (Markdown / JSON)
- Session persistence in browser (localStorage / IndexedDB)
- Prompt-injection and PII-minimization controls
- Ten evaluation fixtures with expected band/risk checks
- Basic usage/cost telemetry (privacy-preserving)

### Out (explicit)

- Official compliance certification (SOC2, ISO, HIPAA attestation)
- Multi-tenant org accounts / SSO (later engineering theme)
- Continuous scanning of live production systems
- Auto-remediation / PR bots
- Marketplace of third-party auditors
- Monetization / paywalls
- Uploading large proprietary codebases as the primary input

## 5. Guided assessment journey

1. **Context** — system type, users, data sensitivity, blast radius  
2. **Dimension interview** — adaptive question sets (see question bank)  
3. **Evidence prompts** — optional links/notes (not required for MVP score)  
4. **Compute scores** — deterministic dimension scores + hard gates  
5. **AI narrative** — schema-constrained explanation + remediation, with RAG citations  
6. **Report** — band, scores, risks, plan, citations; export  

## 6. Eight production-readiness dimensions

| ID | Dimension | Focus |
|----|-----------|--------|
| D1 | Use case & risk fit | Clarity of job-to-be-done, misuse, blast radius |
| D2 | Data & privacy | Training/inference data, PII, retention, residency |
| D3 | Evaluation quality | Offline/online evals, golden sets, regression gates |
| D4 | Security & abuse | Prompt injection, tool misuse, authz, supply chain |
| D5 | Reliability & ops | SLOs, fallbacks, rollback, dependency failure modes |
| D6 | Observability | Tracing, prompt/version logging, incident signals |
| D7 | Human oversight | Escalation, review loops, accountability |
| D8 | Cost & performance | Latency budgets, token/cost controls, capacity |

## 7. Readiness bands and deterministic rules

Bands: `Not Ready` · `Pilot Only` · `Production with Guards` · `Production Ready`

Hard gates (examples — formalized in rubric):

- High data sensitivity + no human oversight path → cannot be `Production Ready`
- No evaluation evidence for customer-facing generative features → max `Pilot Only`
- Open prompt-injection exposure on tool-calling agents → max `Not Ready` until mitigated

Overall band = min(dimension-derived band, hard-gate ceiling).

## 8. Structured output schema

See `docs/product/output-schema.md`. Core objects:

- `AssessmentContext`
- `DimensionScore[]`
- `ReadinessReport` (band, summary, risks, remediation, citations, model metadata)

LLM must emit schema-valid JSON; UI renders from validated object only.

## 9. AI orchestration and RAG design

- **Deterministic path:** score dimensions and apply band rules in code  
- **LLM path:** narrative summary, risk wording, remediation steps, citation selection  
- **RAG:** retrieve top-k chunks from versioned corpus; require citation IDs in output  
- **Failure mode:** if LLM/schema fails, still show deterministic scores/band with “narrative unavailable”

## 10. Security, privacy, and prompt-injection controls

- Treat free-text answers as untrusted input  
- Separate system instructions from user content with clear delimiters  
- Strip/ignore attempted instruction overrides in user fields  
- Redact obvious secrets before model calls when feasible  
- No persistent server-side storage of assessment text in MVP (unless explicitly added later)  
- Corpus is allowlisted; no arbitrary URL fetch in MVP  

## 11. Ten initial evaluation scenarios

See `docs/eval/evaluation-scenarios.md` and fixtures under `docs/eval/fixtures/`.

## 12. Observability and cost controls

- Log: assessment id (client UUID), model, token estimates, latency, schema validation result  
- Do not log full free-text answers by default  
- Cap: max tokens per request; daily soft budget in config  
- Cache narrative by hash of (scores + context features + corpus version)

## 13. Recommended technical architecture

See `docs/architecture/architecture.md`.

Summary: Next.js App Router; client assessment state; server route for LLM+RAG; in-repo corpus; schema validation; Vercel deploy.

## 14. Five delivery milestones

See `docs/delivery/milestones.md`.

1. Discovery pack complete (this phase)  
2. Assessment UX + deterministic scoring  
3. LLM narrative + RAG citations  
4. Evals, security hardening, cost guards  
5. Polish, deploy, portfolio documentation  

## 15. Acceptance criteria

See `docs/delivery/acceptance-criteria.md` (functional, AI-quality, security, UX, portfolio).

## 16. First deliverables required (Cursor + Cowork)

**Before substantial coding:**

1. Discovery brief  
2. Product decisions log  
3. Question bank  
4. Readiness rubric (bands + hard gates)  
5. Output schema  
6. Threat model  
7. Reference corpus index (+ seed sources)  
8. Ten evaluation fixtures  
9. Architecture doc  
10. Cost estimate  
11. Implementation backlog  

**Cowork (if available):** critique rubric/hard gates, tighten enterprise wording, supply missing original handoff for reconciliation.

---

## Agent instructions

1. Read `AGENTS.md`  
2. Treat this handoff + `docs/product/*` as product source of truth until owner revises  
3. Do not start Next.js feature coding until owner marks discovery reviewed  
4. Keep public messaging free of monetization language  
