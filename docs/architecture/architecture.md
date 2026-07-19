# Architecture (MVP)

**Version:** `arch@0.1.0`  
**Status:** Proposed — implement after discovery review

## Goals

- Independently shippable Next.js app  
- Deterministic scoring in application code  
- LLM narrative + small RAG corpus on the server  
- Useful degraded mode for scores when LLM fails  
- Privacy-preserving by default (client-held assessments)

## High-level

```
┌──────────────────────────────────────────────┐
│ Browser                                      │
│  Assessment wizard (client state)            │
│  localStorage / IndexedDB persistence        │
│  Report renderer + Markdown/JSON export      │
└──────────────────┬───────────────────────────┘
                   │ POST /api/assess/narrative
┌──────────────────▼───────────────────────────┐
│ Next.js server                               │
│  1. Validate input size / rate limit         │
│  2. Recompute scores + hard gates (trust)    │
│  3. Retrieve corpus chunks (by weak dims)    │
│  4. Call model with fenced user data         │
│  5. Schema-validate LLM subset               │
│  6. Merge → ReadinessReport                  │
└──────────────────┬───────────────────────────┘
                   │
          ┌────────▼────────┐
          │ Model provider  │
          └─────────────────┘

content/corpus/       → versioned chunks
docs/eval/fixtures/   → CI scoring + narrative mocks
```

## Key modules (planned)

| Module | Responsibility |
|--------|----------------|
| `src/lib/scoring/` | Dimension scores, bands, hard gates |
| `src/lib/schema/` | Zod types for report + LLM subset |
| `src/lib/corpus/` | Load + retrieve chunks |
| `src/lib/ai/` | Provider adapter, prompt registry, caps |
| `src/lib/security/` | Delimiters, redaction helpers, blocklist |
| `src/app/api/assess/narrative` | Orchestration route |
| `src/app/(wizard)/` | Guided UX |

## Trust model

- Client may send answers; server **recomputes** scores/gates (never trusts client band).  
- Model cannot change `finalBand` / `overallScore`.  
- Citations resolved server-side from corpus IDs only.

## RAG (MVP)

- Start **without** vector DB: tag chunks by dimension + keywords; pick top-k for weakest dimensions.  
- Pass chunk ID + text into prompt.  
- Embeddings optional later if quality needs it.

## Persistence

| Data | Where |
|------|-------|
| In-progress assessment | Browser |
| Finished report | Browser (+ user export) |
| API keys | Server env |
| Corpus | Git |

## Observability

- Structured log per narrative request: `assessmentId`, latency, token estimates, `narrativeStatus`, `corpusVersion`, `promptVersion`  
- Do not log full free-text by default  
- Optional client analytics: step completion only

## Deployment

- Vercel project + subdomain TBD  
- Env: see `.env.example` (`OPENAI_API_KEY`, `OPENAI_MODEL`, rate limit config)  
- Preview deployments for rubric experiments  
- Provider: **OpenAI** (PD-013)

## Non-goals (architecture)

- Shared monorepo with SleepCheck/RetireCheck  
- Multi-tenant auth  
- Streaming tool-calling agents  
- Fetching arbitrary customer URLs  

## Open architecture choices (owner)

1. ~~Provider~~ → OpenAI  
2. Default model id (proposed: `gpt-4.1-mini` for cost; upgrade path to `gpt-4.1` if narrative quality needs it)  
3. Zod-only vs JSON Schema artifacts in repo  
4. Subdomain / short product name  
