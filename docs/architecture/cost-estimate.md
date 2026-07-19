# Cost estimate (MVP)

**Version:** `cost@0.1.0`  
**Assumptions:** OpenAI API (PD-013); refine after prompt sizing and final model id.

## Unit economics (narrative generation)

| Item | Estimate |
|------|----------|
| Input tokens (scores + answers + ≤6 chunks) | 2,500–4,500 |
| Output tokens (structured narrative) | 800–1,500 |
| Total tokens / successful narrative | ~4,000–6,000 |
| Cached repeat (same hash) | ~$0 incremental |

### Illustrative provider math

Using a mid-tier chat model ballpark of **$3 / 1M input** and **$15 / 1M output** (order-of-magnitude only):

| Volume | Approx monthly model cost |
|--------|---------------------------|
| 100 narratives | < $5 |
| 1,000 narratives | ~$20–40 |
| 10,000 narratives | ~$200–400 |

Hosting (Vercel hobby/pro) dominates at low volume; model cost dominates if the demo goes viral without caps.

## Cost controls (required for MVP)

| Control | Default |
|---------|---------|
| Max input characters (free text total) | 4,000 |
| Max output tokens | 1,500 |
| Rate limit | 10 narratives / IP / day (tunable) |
| Response cache | Hash(context features + answers + corpusVersion + promptVersion) |
| Model tier | Default `gpt-4.1-mini` (or current OpenAI mini-class); stronger model only if evals fail |
| Kill switch | Env flag disables LLM; scores-only mode |

## Non-model costs

| Item | Notes |
|------|-------|
| Vercel | Preview + prod |
| Domain | Existing `weidong-shi.com` subdomain |
| Embeddings DB | **$0** in MVP (keyword retrieval) |
| Observability SaaS | Optional later; start with platform logs |

## Budget recommendation (portfolio demo)

- Soft monthly model budget: **$25** while public and unauthenticated  
- If exceeded: scores-only mode + banner  
- No need for reserved capacity in M1–M4  

## Sensitivity

Costs rise if:

- Corpus chunks grow large  
- Users paste long documents into free text  
- Narrative regenerated every score tweak without caching  

Mitigate with caching keyed on score+answer hash and aggressive free-text caps.
