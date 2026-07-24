# Cost estimate (MVP)

**Version:** `cost@0.2.0`  
**Assumptions:** OpenAI API (PD-013); refine after prompt sizing and final model id.

## Unit economics (narrative generation)

| Item | Estimate |
|------|----------|
| Input tokens (scores + answers + ≤6 chunks) | 2,500–4,500 |
| Output tokens (structured narrative) | 800–1,500 |
| Total tokens / successful narrative | ~4,000–6,000 |
| Schema-repair retry (rare) | ~1× extra call when JSON fails Zod/shape |
| Cached repeat (same hash) | ~$0 incremental |
| Sample report (`/sample`) | **$0** (pre-generated JSON, no OpenAI) |

### Illustrative provider math

Using a mid-tier chat model ballpark of **$3 / 1M input** and **$15 / 1M output** (order-of-magnitude only):

| Volume | Approx monthly model cost |
|--------|---------------------------|
| 100 narratives | < $5 |
| 1,000 narratives | ~$20–40 |
| 10,000 narratives | ~$200–400 |

Hosting (Vercel hobby/pro) dominates at low volume; model cost dominates if the demo goes viral without caps.

## Cost controls (required for MVP)

| Control | Default | Notes |
|---------|---------|-------|
| Max input characters (free text total) | 4,000 | Truncated server-side |
| Max output tokens | 1,500 | `AI_MAX_OUTPUT_TOKENS` |
| Rate limit | **Best-effort** 10 / IP / day | In-memory Map per serverless isolate — **not** a durable global quota (see below) |
| Response cache | 1 hour in-memory | Hash(context + answers + corpus + prompt + model) |
| Model tier | Default `gpt-4o-mini` | Stronger model only if evals fail |
| Kill switch | Env flag | Scores-only mode |
| Schema repair | 1 retry | Then fall back to scores-only |

### Rate-limit decision (P1)

**Decision: keep in-memory best-effort; do not add Vercel KV for MVP.**

Reasons:

1. Portfolio traffic is low; cache + 1500-token cap dominate cost control.
2. A Map resets on cold start and is not shared across isolates — claiming a hard “10/day” would be dishonest.
3. Durable limiting (KV / Upstash) can plug in later behind `checkRateLimit` without changing the route contract.

UI/API copy should say **best-effort** when the limit trips. Soft monthly model budget remains **~$25** while public and unauthenticated; if exceeded, set `AI_NARRATIVE_ENABLED=false` for scores-only.

## Non-model costs

| Item | Notes |
|------|-------|
| Vercel | Preview + prod |
| Domain | Existing `weidong-shi.com` subdomain |
| Embeddings DB | **$0** in MVP (keyword retrieval) |
| Observability SaaS | Optional later; start with platform logs |
| Vercel KV | **Deferred** — not required for MVP rate limiting |

## Budget recommendation (portfolio demo)

- Soft monthly model budget: **$25** while public and unauthenticated  
- If exceeded: scores-only mode + banner  
- No need for reserved capacity in M1–M5  

## Sensitivity

Costs rise if:

- Corpus chunks grow large  
- Users paste long documents into free text  
- Narrative regenerated every score tweak without caching  
- Schema-repair rate is high (monitor `narrative_repaired` / `narrative_schema_failed` in Vercel logs)

Mitigate with caching keyed on score+answer hash, aggressive free-text caps, and prompt/schema tuning when `schema_failed` exceeds ~5%.
