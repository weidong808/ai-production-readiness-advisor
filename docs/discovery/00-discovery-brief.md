# Discovery brief

**Product:** AI Production Readiness Advisor  
**Phase:** Discovery (M1)  
**Last updated:** 2026-07-19

## Problem

Teams ship AI features with uneven readiness: missing evals, weak abuse controls, unclear human oversight, and no shared language for go/no-go. Existing checklists are static PDFs; generic chatbots do not produce comparable, structured assessments.

## Opportunity (portfolio + product)

Build a guided advisor that:

- Speaks the language of architects and staff engineers
- Separates **deterministic scoring** from **AI narrative**
- Demonstrates production AI engineering practices *in the product itself*

## Goals (MVP)

1. Complete a guided assessment in ≤ 15 minutes for a typical feature  
2. Produce a schema-valid report with band, scores, risks, remediation, citations  
3. Remain useful even when the LLM path fails (scores/band still render)  
4. Provide 10 fixtures that lock scoring + band behavior  
5. Document architecture and lessons for an AI in Action case study  

## Non-goals (MVP)

- Certification / formal audit output  
- Org accounts, SSO, multi-user collaboration  
- Live infra scanning  
- Large codebase ingestion as primary workflow  

## Success signals

| Signal | Measure |
|--------|---------|
| Clarity | Peer can explain band + top 3 risks from a report in < 2 minutes |
| Determinism | Same answers → same band/scores across runs |
| AI quality | Narrative fixtures pass citation + schema checks |
| Trust | Explicit “advisory only” framing; no certification language |
| Engineering lesson | Case study can teach structured outputs + RAG + evals |

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Looks like fake compliance product | Strong disclaimers; advisory framing; no seals/badges of certification |
| Rubric too opinionated / wrong | Publish rubric; keep versioned; owner review before coding |
| RAG hallucinations | Require citation IDs; fail closed to uncited claims in evals |
| Cost blowups | Caps, caching, small prompts, small corpus |
| Scope creep into HabitCheck / platform | Independent repo; no shared monorepo required for MVP |

## Open questions (for owner)

1. Public product short name / subdomain? (working: descriptive long name)  
2. Confirm App #3 positioning vs HabitCheck in public roadmap  
3. ~~Default model provider for MVP?~~ → **OpenAI** (PD-013)  
4. Any dimensions to rename for your personal vocabulary?  
5. Drop-in original Cowork handoff for reconciliation?

## Exit criteria for discovery

- [x] Working handoff in repo  
- [x] Question bank, rubric, schema, threat model, corpus plan, evals, architecture, cost, backlog  
- [x] Owner review / edits  
- [x] Explicit “ok to scaffold app” from owner (2026-07-19)  
