# Implementation backlog

Prioritized for post-discovery. IDs are stable references.

## P0 — Foundation (M2)

| ID | Item | Notes |
|----|------|-------|
| B-001 | Next.js + TS + Tailwind v4 scaffold | Match SleepCheck conventions where sensible |
| B-002 | Zod schemas for context/answers/report | From `output-schema.md` |
| B-003 | `scoreAssessment` + `applyHardGates` | Pure functions; fixture-tested |
| B-004 | Question bank as typed data | Drive wizard from data, not hardcoding copy only in JSX |
| B-005 | Wizard UX (context → dimensions → review) | Mobile-friendly; progress indicator |
| B-006 | Local persistence | Resume assessment |
| B-007 | Scores-only report view | Band, dimensions, gates, disclaimer |

## P1 — AI path (M3) — done

| ID | Item | Notes |
|----|------|-------|
| B-010 | Corpus chunk files + loader | `content/corpus/corpus.json` |
| B-011 | Keyword/tag retriever | top-k by weak dimensions |
| B-012 | OpenAI provider adapter + env config | `OPENAI_API_KEY` / `OPENAI_MODEL` (PD-013) |
| B-013 | Prompt templates versioned in repo | `narrative@0.1.0` |
| B-014 | Narrative API route | Recompute scores server-side |
| B-015 | Schema validate + merge | `narrativeStatus` handling |
| B-016 | Citation resolution | Drop unknown IDs |
| B-017 | Export MD/JSON | Include disclaimer |

## P2 — Hardening (M4)

| ID | Item | Notes |
|----|------|-------|
| B-020 | Rate limit + body size limits | |
| B-021 | Response cache | Hash-based |
| B-022 | Compliance phrase blocklist | S10 |
| B-023 | Redaction helper (secrets patterns) | Best-effort |
| B-024 | Unit/integration tests S01–S10 | No live LLM in CI |
| B-025 | Structured logging | No raw answers by default |

## P3 — Launch polish (M5)

| ID | Item | Notes |
|----|------|-------|
| B-030 | Landing page (brand + one CTA) | Portfolio-quality |
| B-031 | Empty/error/degraded states | |
| B-032 | A11y pass | Keyboard, contrast, labels |
| B-033 | Deploy + custom domain | |
| B-034 | README demo script | |
| B-035 | Public roadmap one-pager update | Separate PR in roadmap repo |

## Explicitly not in backlog (MVP)

- Auth / teams / sharing links server-side  
- Vector database  
- PDF upload analysis  
- Auto-opened GitHub issues from remediation  
- Billing  

## Suggested first coding slice (after approval)

1. B-001 → B-003 → B-007 (scores-only vertical slice)  
2. Then wizard (B-004–B-006)  
3. Then AI path (B-010–B-016)  
