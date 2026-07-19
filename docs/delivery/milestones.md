# Delivery milestones

## M1 — Discovery pack

**Outcome:** Product rules clear enough to implement without redesign.

- [x] Working handoff in repo  
- [x] Discovery brief + decisions log  
- [x] Question bank, rubric, schema  
- [x] Threat model, corpus plan, eval fixtures  
- [x] Architecture + cost + backlog + acceptance  
- [x] Owner review  
- [x] “Ok to scaffold app” (approved 2026-07-19)

## M2 — Assessment UX + deterministic scoring

**Outcome:** Full wizard works without LLM.

- [x] Next.js scaffold  
- [x] Wizard + local persistence  
- [x] Scoring engine + hard gates  
- [x] Report UI for scores/band  
- [x] Unit tests for S01–S06  

## M3 — LLM narrative + RAG

**Outcome:** Schema-valid narratives with citations.

- [x] `/api/assess/narrative` orchestration  
- [x] Corpus seed chunks (`content/corpus/corpus.json`)  
- [x] Prompt registry + merge/validate  
- [x] Degraded mode when LLM fails  
- [x] Export Markdown/JSON  
- [x] OpenAI provider (PD-013) + in-memory cache + rate limit

## M4 — Evals, security, cost guards (current)

**Outcome:** CI protects quality and abuse boundaries.

- [x] Narrative mocks S07–S10 (no live LLM in CI)  
- [x] Rate limits, body/free-text caps, cache  
- [x] Blocklist + disclaimer enforcement  
- [x] Secret redaction helper  
- [x] Structured logging (no raw answers by default)  
- [x] Quality flags (e.g. missing citations on critical risks) 

## M5 — Polish, deploy, portfolio

**Outcome:** Public demo + case-study materials.

- A11y / responsive polish  
- Deploy subdomain  
- README screenshots + architecture link  
- Light public roadmap note (App #3 positioning)  
- Hub article / LinkedIn later (after live demo)  

## Dependency rule

Do not start M2 coding until M1 owner review is complete.
