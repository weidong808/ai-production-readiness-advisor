# Product decisions log

Decisions made during discovery. Change deliberately; bump rubric/schema versions when scoring rules change.

| ID | Date | Decision | Rationale | Status |
|----|------|----------|-----------|--------|
| PD-001 | 2026-07-19 | Build **AI Production Readiness Advisor** as App #3 (not HabitCheck) | Stronger enterprise/architecture portfolio signal; HabitCheck remains a separate Better Living candidate | Proposed |
| PD-002 | 2026-07-19 | **Deterministic scoring + band rules** in application code | Comparable results; eval-friendly; LLM cannot silently change go/no-go | Accepted |
| PD-003 | 2026-07-19 | LLM used for **narrative, remediation wording, citation selection** only | Reduces hallucination risk on the consequential decision | Accepted |
| PD-004 | 2026-07-19 | Eight dimensions D1–D8 as defined in handoff | Covers risk, data, eval, security, ops, observability, oversight, cost | Accepted |
| PD-005 | 2026-07-19 | Four bands: Not Ready / Pilot Only / Production with Guards / Production Ready | Matches how launch reviews actually talk | Accepted |
| PD-006 | 2026-07-19 | MVP persistence = **client-side only** | Privacy + speed; no auth required | Accepted |
| PD-007 | 2026-07-19 | No arbitrary URL fetch / codebase upload in MVP | Shrinks threat model; keeps demo focused | Accepted |
| PD-008 | 2026-07-19 | Corpus is **small, curated, versioned in-repo** | Reviewable; portable; good teaching artifact | Accepted |
| PD-009 | 2026-07-19 | Public framing: educational showcase, advisory only | Aligns with AI in Action / AGENTS.md | Accepted |
| PD-010 | 2026-07-19 | Working handoff reconstructed until original Cowork file is provided | Unblocks discovery; must reconcile if original differs | Temporary |
| PD-011 | 2026-07-19 | Stack: Next.js App Router + TS + Tailwind v4 | Matches RetireCheck / SleepCheck / hub site skills | Proposed |
| PD-012 | 2026-07-19 | Short brand name deferred | Avoid conflicting with Check-family naming until owner chooses | Open |
| PD-013 | 2026-07-19 | **OpenAI** as MVP model provider | Owner purchased OpenAI API service | Accepted |
| PD-014 | 2026-07-19 | M1 discovery approved; proceed to M2 scaffold | Owner: “approved” | Accepted |
| PD-015 | 2026-07-19 | M3 narrative path enabled with OpenAI + in-repo corpus | Owner: “start m3” | Accepted |
| PD-016 | 2026-07-19 | M4 hardening (evals S07–S10, redaction, caps, logs) | Owner: “go next” after key rotate | Accepted |
| PD-017 | 2026-07-19 | Proposed public subdomain `readiness.weidong-shi.com` | M5 deploy prep; owner can rename | Proposed |
| PD-018 | 2026-07-19 | App #3 = Readiness Advisor; HabitCheck stays separate candidate | Roadmap note | Accepted |

## Naming

| Field | Value |
|-------|-------|
| Product name | AI Production Readiness Advisor |
| Repo | `ai-production-readiness-advisor` |
| Short name | TBD |
| Subdomain | TBD |

## Versioning

| Artifact | Version |
|----------|---------|
| Rubric | `rubric@0.1.0` |
| Question bank | `questions@0.1.0` |
| Output schema | `report@0.1.0` |
| Corpus | `corpus@0.1.0` |
